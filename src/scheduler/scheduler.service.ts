import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedsService } from '../feeds/feeds.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly feedsService: FeedsService) {}

  @Cron(CronExpression.EVERY_6_HOURS) // Every Six hour
  async handleCron() {
    await this.feedsService.fetchFeeds();
  }
}
