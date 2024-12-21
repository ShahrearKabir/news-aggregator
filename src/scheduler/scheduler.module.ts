import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FeedsService } from 'src/feeds/feeds.service';
import { ArticlesService } from 'src/articles/articles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/articles/schemas/article.schema';
import { Feed, FeedSchema } from 'src/feeds/schemas/feed.schema';
import { TopicExtractorService } from 'src/topics/topics.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
     MongooseModule.forFeature([
          { name: Article.name, schema: ArticleSchema },
          { name: Feed.name, schema: FeedSchema },
        ]),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, FeedsService, ArticlesService, TopicExtractorService]
})
export class SchedulerModule {}
