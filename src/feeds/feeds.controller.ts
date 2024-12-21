import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) { }

  // private feeds: string[] = [
  //   'https://rss.cnn.com/rss/cnn_topstories.rss',
  //   'https://feeds.bbci.co.uk/news/rss.xml',
  // ]; // Default feeds (can be moved to a service)

  @Get()
  async getFeeds() {
    return this.feedsService.getFeeds();
  }

  @Post()
  async addFeed(@Body('url') url: string) {
    if (!url || !url.startsWith('http')) {
      throw new HttpException('Invalid RSS feed URL', HttpStatus.BAD_REQUEST);
    }

    return this.feedsService.addFeed(url);
  }

  @Post('fetch')
  async fetchFeeds() {
    await this.feedsService.fetchFeeds();
    return { message: 'Feeds fetched successfully' };
  }
}
