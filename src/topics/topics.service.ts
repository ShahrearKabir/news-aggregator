import { Injectable, Logger } from '@nestjs/common';
import * as natural from 'natural';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';
import * as AWS from 'aws-sdk';

@Injectable()
export class TopicExtractorService {

    private readonly logger = new Logger(TopicExtractorService.name);
    private readonly openai: OpenAI;
    private comprehend: AWS.Comprehend;

    constructor() {
        // Initialize OpenAI
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
        });

        // Initialize AWS
        // AWS.config.update({ region: 'us-east-1' });
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1', // Default region
        });

        this.comprehend = new AWS.Comprehend();

        // console.log('this.comprehend:::', this.comprehend);

    }

    // Extract topics from text using frequency analysis starting from here
    extractTopics(text: string): string[] {
        const tokenizer = new natural.WordTokenizer();
        // Tokenize text into words
        const tokens = tokenizer.tokenize(text.toLowerCase());

        // Frequency analysis to get top keywords
        const frequencyMap: Record<string, number> = {};
        tokens.forEach((word) => {
            if (word.length > 3) {
                // Ignore very short words
                frequencyMap[word] = (frequencyMap[word] || 0) + 1;
            }
        });

        // Sort keywords by frequency
        const sortedKeywords = Object.keys(frequencyMap).sort(
            (a, b) => frequencyMap[b] - frequencyMap[a],
        );

        // Return the top 5 keywords
        return sortedKeywords.slice(0, 5);
    }


    // Extract topics from text using OpenAI GPT-4
    async extractTopicsOpenAI(text: string): Promise<string[]> {
        if (!text) {
            this.logger.warn('No text provided for topic extraction.');
            return [];
        }

        console.log('extractTopicsOpenAI text:::', text);

        try {
            const chatCompletion: ChatCompletion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                // messages: [
                //     {
                //         role: 'user',
                //         content: text,
                //     },
                // ],
                messages: [
                    { role: 'system', content: 'Extract the top 5 relevant topics from text.' },
                    { role: 'user', content: `Text: "${text}"` },
                ],
            });

            console.log('chatCompletion:::', chatCompletion);

            const topics = chatCompletion.choices[0].message?.content
                ?.trim()
                ?.split(',')
                ?.map((topic) => topic.trim());

            this.logger.log(`Extracted topics: ${topics}`);
            console.log('topics:::', topics);

            return topics || [];
        } catch (error) {
            this.logger.error('Failed to extract topics using OpenAI GPT-4', error.stack);
            console.log('error:::', error);

            return [];
        }
    }



    // Extract named entities starting from here
    extractEntities(text: string): { people: string[]; locations: string[]; organizations: string[] } {
        // Basic example using regex
        return {
            people: [], // Implement a regex or library for named entity recognition
            locations: [],
            organizations: [],
        };
    }

    // Extract named entities using AWS Comprehend
    async extractEntitiesAWS(text: string): Promise<any[]> {
        try {
            // const params = {
            //     Text: text,
            //     LanguageCode: 'en',
            // };
            // const response = await this.comprehend.detectEntities(params).promise();
            // console.log('extractEntitiesAWS response:::', response);

            // return response.Entities?.map(entity => ({
            //     text: entity.Text,
            //     type: entity.Type,
            //     score: entity.Score,
            // })) || [];

            var params = {
                LanguageCode: 'en', /* required */
                Text: text
            };

            const response = await this.comprehend.detectEntities(params).promise();
            console.log('extractEntitiesAWS response:::', response);
            return response.Entities?.map(entity => ({
                text: entity.Text,
                type: entity.Type,
                score: entity.Score,
            })) || [];


        } catch (error) {
            this.logger.error('Error extracting entities:', error.stack);
            console.log('extractEntitiesAWS error:::', error);

            return [];
        }
    }


    // Extract named entities using OpenAI
    async extractEntitiesOpenAI(text: string): Promise<any[]> {
        try {
            const chatCompletion = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'Identify named entities (people, locations, organizations) from the text.' },
                    { role: 'user', content: `Text: "${text}"` },
                ],
                max_tokens: 100,
            });

            return JSON.parse(chatCompletion.choices[0].message?.content || '[]');

        } catch (error) {
            this.logger.error('Error extracting entities:', error.stack);
            return [];
        }
    }

}
