import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Feed extends Document {
  @Prop({ required: false })
  title: string;

  @Prop({ required: true })
  url: string;

}

export const FeedSchema = SchemaFactory.createForClass(Feed);
