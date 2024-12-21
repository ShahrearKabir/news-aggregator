import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../articles/schemas/article.schema';
import { ArticlesService } from 'src/articles/articles.service';
import { TopicExtractorService } from 'src/topics/topics.service';
import { Feed, FeedSchema } from './schemas/feed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Feed.name, schema: FeedSchema },
    ]),
  ],
  controllers: [FeedsController],
  providers: [FeedsService, ArticlesService, TopicExtractorService],
})
export class FeedsModule { }
