import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articleService: ArticlesService) { }

    @Get()
    async getArticles(
        @Query('keywords') keywords?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const filters: { keywords?: string[]; dateRange?: [Date, Date] } = {};

        // Parse and validate query parameters
        if (keywords) {
            filters.keywords = keywords.split(','); // Split by commas for multiple keywords
            // filters.$or = [
            //     { title: { $regex: keywords, $options: 'i' } },
            //     { description: { $regex: keywords, $options: 'i' } },
            // ];
        }

        // Parse and validate date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new HttpException('Invalid date range', HttpStatus.BAD_REQUEST);
            }

            filters.dateRange = [start, end];
        }

        // Fetch articles
        const articles = await this.articleService.filterArticles(filters);

        return {
            count: articles.length,
            data: articles
        }
    }
}
