import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as RSSParser from 'rss-parser';
import { ArticlesService } from 'src/articles/articles.service';
import { Feed } from './schemas/feed.schema';
import { Model } from 'mongoose';

@Injectable()
export class FeedsService {
    private readonly logger = new Logger(FeedsService.name);
    private rssParser = new RSSParser();

    constructor(
        private readonly articleService: ArticlesService,
        @InjectModel(Feed.name) private feedModel: Model<Feed>,
    ) { }

    // Add a new feed
    async addFeed(url: string) {
        if (!url || !url.startsWith('http')) {
            throw new HttpException('Invalid RSS feed URL', HttpStatus.BAD_REQUEST);
        }

        const existingFeed = await this.feedModel.findOne({ url });
        if (existingFeed?.url === url) {
            throw new HttpException('Feed URL already exists', HttpStatus.CONFLICT);
        }

        return this.feedModel.create({ url });
    }

    // Fetch feeds and save articles
    async fetchFeeds(): Promise<void> {
        const existingFeed = await this.feedModel.find({});
        // let count1 = 0;
        for (const feedUrl of existingFeed) {
            try {
                const feed = await this.rssParser.parseURL(feedUrl?.url);
                // console.log('feed:::', feed);

                // count1++;
                // let count2 = 0;
                for (const item of feed.items) {
                    const article = {
                        title: item.title,
                        description: item.contentSnippet,
                        publicationDate: new Date(item.pubDate),
                        sourceUrl: item.link,
                    };
                    // count2++;
                    // console.log(`article ${count1}-${count2}:::`, article);

                    await this.articleService.saveArticle(article);
                }

            } catch (error) {
                this.logger.error(`Failed to fetch feed from ${feedUrl}`, error.stack);
            }
        }
    }

    // Get all feeds
    getFeeds() {
        return this.feedModel.find({});
    }
}
