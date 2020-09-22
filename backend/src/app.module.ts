import { databaseUrl } from '../config.json';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';

const dbUrl = process.env.DATABASE_URL || databaseUrl;

@Module({
  imports: [
    MongooseModule.forRoot(dbUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      connectionFactory: connection => {
        connection.plugin(require('@meanie/mongoose-to-json'));
        return connection;
      },
    }),
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
