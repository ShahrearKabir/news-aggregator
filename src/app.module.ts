import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedsModule } from './feeds/feeds.module';
import { ArticlesModule } from './articles/articles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_DB_URL}`),
    FeedsModule,
    ArticlesModule,
    SchedulerModule
  ],
})
export class AppModule {}
