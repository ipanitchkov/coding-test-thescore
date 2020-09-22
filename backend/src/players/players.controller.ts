import * as joi from 'joi';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotAcceptableException,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Player } from './schemas/player.schema';
import { PlayersService } from './players.service';
import { Response } from 'express';
import * as moment from 'moment';

const argumentsSchema = joi
  .object()
  .keys({
    from: joi
      .number()
      .integer()
      .positive()
      .required(),
    limit: joi
      .number()
      .integer()
      .positive()
      .required(),
    sortBy: joi
      .string()
      .valid(
        'Player',
        'Team',
        'Pos',
        'Att',
        'Att/G',
        'Yds',
        'Avg',
        'Yds/G',
        'TD',
        'Lng',
        'LngT',
        '1st',
        '1st%',
        '20+',
        '40+',
        'FUM',
      ),
    sortDirection: joi.string().valid('asc', 'desc'),
    filter: joi.string(),
  })
  .and('from', 'limit')
  .and('sortBy', 'sortDirection');

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('import')
  async import(@Body() players: Player[]): Promise<void> {
    await this.playersService.import(players);
  }

  @Get()
  async findAll(
    @Query('from', ParseIntPipe) from: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('filter') filter: string,
    @Res() response: Response,
  ): Promise<any> {
    const { error } = argumentsSchema.validate({
      from,
      limit,
      sortBy,
      sortDirection,
      filter,
    });

    if (error) {
      throw new NotAcceptableException(error.message, error.message);
    }

    const result = await this.playersService.findAll(
      from,
      limit + 1,
      sortBy,
      sortDirection,
      filter,
    );

    if (result.length === limit + 1) {
      result.pop();
      response.set('X-Has-More-Players', 'true');
    } else {
      response.set('X-Has-More-Players', 'false');
    }

    return response.status(HttpStatus.OK).json(result);
  }

  @Get('export')
  async export(
    @Query('from', ParseIntPipe) from: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('filter') filter: string,
    @Res() response: Response,
  ): Promise<any> {
    const { error } = argumentsSchema.validate({
      from,
      limit,
      sortBy,
      sortDirection,
      filter,
    });

    if (error) {
      throw new NotAcceptableException(error.message, error.message);
    }

    const result = await this.playersService.findAll(
      from,
      limit,
      sortBy,
      sortDirection,
      filter,
    );
    let data = '';

    if (result.length) {
      Object.keys(result[0]).forEach(key => {
        data += `${key},`;
      });
      data = data.slice(0, -1) + '\n';
      result.forEach(player => {
        Object.values(player).forEach(value => {
          data += `${value},`;
        });
        data = data.slice(0, -1) + '\n';
      });
    }

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="players-${moment().format(
        'YYYY-MM-DD-HH-mm-ss',
      )}.csv"`,
    );
    response.send(Buffer.from(data));
  }
}
