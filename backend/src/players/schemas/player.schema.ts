import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player extends Document {
  @Prop()
  _id: string;
  @Prop()
  Player: string;
  @Prop()
  Team: string;
  @Prop()
  Pos: string;
  @Prop()
  Att: number;
  @Prop()
  'Att/G': number;
  @Prop()
  Yds: number;
  @Prop()
  Avg: number;
  @Prop()
  'Yds/G': number;
  @Prop()
  TD: number;
  @Prop()
  Lng: number;
  @Prop()
  LngT: boolean;
  @Prop()
  '1st': number;
  @Prop()
  '1st%': number;
  @Prop()
  '20+': number;
  @Prop()
  '40+': number;
  @Prop()
  FUM: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
