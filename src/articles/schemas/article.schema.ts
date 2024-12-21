import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class NamedEntities {
    text: string;
    type: string;
    score: string;
}

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  publicationDate: Date;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop([String])
  topics: string[];

  @Prop()
  namedEntities: NamedEntities
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
