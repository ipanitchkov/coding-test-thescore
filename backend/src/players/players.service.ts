import { Injectable } from '@nestjs/common';
import { Player } from './schemas/player.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  async import(players: any[]): Promise<void> {
    await this.playerModel.deleteMany({});

    players.forEach(async player => {
      const yards =
        typeof player.Yds === 'string'
          ? parseInt(player.Yds.replace(',', ''), 10)
          : player.Yds;
      let longestRush = player.Lng;
      let hasLongestRushTouchdown = false;

      if (typeof longestRush === 'string') {
        const parts = longestRush.split('T');

        hasLongestRushTouchdown = parts.length === 2;
        longestRush = parseInt(parts[0]);
      }

      const data = {
        _id: player.Player,
        Player: player.Player,
        Team: player.Team,
        Pos: player.Pos,
        Att: player.Att,
        'Att/G': player['Att/G'],
        Yds: yards,
        Avg: player.Avg,
        'Yds/G': player['Yds/G'],
        TD: player.TD,
        Lng: longestRush,
        LngT: hasLongestRushTouchdown,
        '1st': player['1st'],
        '1st%': player['1st%'],
        '20+': player['20+'],
        '40+': player['40+'],
        FUM: player.FUM,
      };
      const newPlayer = new this.playerModel(data);

      await newPlayer.save();
    });
  }

  async findAll(
    from: number,
    limit: number,
    sortBy: string,
    sortDirection: string,
    filter: string,
  ): Promise<Player[]> {
    const filterOption: any = {};

    if (filter) {
      filterOption.Player = RegExp(`^${filter}`);
    }
    const sortOption: any = {};

    if (sortBy && sortDirection) {
      sortOption[sortBy] = sortDirection === 'asc' ? 1 : -1;
    }

    return this.playerModel
      .find(filterOption)
      .select(['-_id', '-__v'])
      .sort(sortOption)
      .skip(from - 1)
      .limit(limit)
      .lean();
  }
}
