import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { TopicExtractorService } from 'src/topics/topics.service';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>,
        private readonly topicExtractor: TopicExtractorService,
    ) { }

    // Save an article
    async saveArticle(article: Partial<Article>): Promise<void> {
        const existing = await this.articleModel.findOne({ sourceUrl: article.sourceUrl });
        if (existing) {
            return; // Avoid duplicates
        }

        // Extract topics
        const topics = await this.topicExtractor.extractTopics(article.description);
        // const topics = await this.topicExtractor.extractTopicsOpenAI(article.description);

        // Extract named entities
        // const namedEntities = await this.topicExtractor.extractEntities(article.description);
        const namedEntities = await this.topicExtractor.extractEntitiesAWS(article.description);

        const newArticle = new this.articleModel({ ...article, topics, namedEntities });
        await newArticle.save();
    }

    // Filter articles
    filterArticles(filters: { keywords?: string[]; dateRange?: [Date, Date] }) {
        const query: any = {};
        if (filters.keywords) {
            query.topics = { $in: filters.keywords };
        }

        if (filters.dateRange) {
            query.publicationDate = { $gte: filters.dateRange[0], $lte: filters.dateRange[1] };
        }

        return this.articleModel.find(query).exec();
    }
}
