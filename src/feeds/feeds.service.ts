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

    // private feeds: string[] = [
    //     'https://rss.cnn.com/rss/cnn_topstories.rss',
    //     'https://feeds.bbci.co.uk/news/rss.xml',
    // ]; // Example feeds

    // sample data
    private data = {
        feedUrl: "http://www.thewire.com/feeds/posts/",
        lastBuildDate: "2017-02-28T12:57:00-05:00",
        link: "http://www.thewire.com/feeds/posts/",
        title: "The Atlantic",
        items: [
            {
                "title": "The 'Only' Profession to 'Celebrate What It Means to Live a Life'",
                "link": "https://www.theatlantic.com/entertainment/archive/2017/02/viola-davis-pos-oscars-only-profession-artists/518082/",
                "pubDate": "2017-02-28T17:57:00.000Z",
                "author": "Spencer Kornhaber",
                "content": "\n\n \n<figure class=\"lead-image\">\n\n    \n        \n        \n        \n            \n            <img\n                src=\"http://cdn.thewire.com/media/img/mt/2017/02/RTS10LLR/lead_large.jpg\"\n                alt=\"Image \"\n                title=\"The &#39;Only&#39; Profession to &#39;Celebrate What It Means to Live a Life&#39;\"\n            >\n        \n        \n    \n\n\n    \n    \n\n</figure>\n\n<p>Yesterday <a href=\"https://www.theatlantic.com/entertainment/archive/2017/02/the-power-of-viola-daviss-oscars-speech/517944/\">I praised</a> Viola Davis’s Oscars speech for being memorable without being explicitly political—for simply talking about her job in a moving and well-written way. Twitter quickly let me know I missed something. On social media and conservative-leaning news sites, Davis’s speech had in fact sparked outrage.</p>\r\n\r\n<p>After explaining that she felt her mission was to “exhume … the stories of the people who dreamed big and never saw those dreams to fruition, people who fell in love and lost,” Davis said this:</p>\r\n\r\n<blockquote>\r\n<p>I became an artist—and thank God I did—because we are the only profession that celebrates what it means to live a life.</p>\r\n</blockquote>\r\n\r\n<aside class=\"callout-placeholder\" data-source=\"curated\"></aside>\r\n\r\n<p>This claim has become one of the discussion items of the right-wing internet following the Oscars ceremony. “Art is wonderful; art is enriching; art can connect us with each other,” writes Ben Shapiro <a href=\"http://www.dailywire.com/news/13885/viola-davis-gives-self-important-tearful-speech-we-ben-shapiro\">at <em>Daily Wire</em></a>. “But the utter arrogance of stating that artists are ‘the only profession that celebrates what it means to live a life’ is astounding. How about doctors? How about stay-at-home mothers, who help shape lives rather than pursuing their own career interests? How about morticians? How about pretty much everybody in a free market economy, giving of themselves to others to improve lives?”</p>\r\n\r\n<p>Variants of that sentiment have ricocheted online, with Davis sometimes misquoted as though she’d said only “actors” celebrate what it means to live a life, or, worse, are the only ones who “know” what it means to live a life.</p>\r\n\r\n<p>Are people right to be offended? Did she say artists are better than anyone else? Reading her words literally, within the context of her speech, and extending her the slightest benefit of the doubt, it’s hard to see backlash against Davis as anything other than a symptom of our overblown culture wars.</p>\r\n\r\n<p>Anyone might “celebrate what it means to live a life” in their own personal ways, but for whom is that a primary function of their profession? Artists, definitely. Clergy, maybe. Doctors <em>save</em> lives rather than celebrating them, and it doesn’t denigrate them to say so. Stay-at-home parents <em>help</em> others, and Davis might even agree that that’s more noble, important, and essential than “celebrating” the meaning of life.</p>\r\n\r\n<p>Her point was simply that artists serve a specific role in telling stories about the human experience, and that she’s glad she’s a part of that.</p>\r\n\r\n<p>Certainly, she could have edited herself to make a less controversial, though arguably less interesting<strong>,</strong> statement. If she’d simply said, “I became an artist—and thank God I did—because we celebrate what it means to live a life,” complaints may have been harder to come by. The “only” highlights a specific way that artists are special, but it also is a dogwhistle to anyone holding strong resentment about Hollywood elitism and condescension. And there’s rarely been a better time to air such resentment than right now.</p>\r\n\r\n<aside class=\"pullquote instapaper_ignore\">Artists are now treated like candidates—expected to choose their words not for truth but for politics.</aside>\r\n\r\n<p>On the right, reflexive disgust for the entertainment industry has taken on new fervor under Donald Trump. During the <a href=\"http://www.thedailybeast.com/articles/2017/02/27/fox-friends-provides-laughably-bad-analysis-of-la-la-land-vs-moonlight-oscar-flub.html\"><em>Fox and Friends</em> after the Oscars</a>, the snafu whereby <em>La La Land</em> mistakenly was announced as Best Picture was spun by Steve Doocy as, “Hollywood got the election wrong, and last night Hollywood got the Oscars wrong.” Guest Tucker Carlson agreed but added that <em>Moonlight</em> “had to win” because the moralizing, politically correct establishment willed it to. Yes, the Oscars were both an out-of-touch catastrophe and an insidiously rigged game.</p>\r\n\r\n<p>Donald Trump has given his own interpretation of the Academy’s screwup: “I think they were focused so hard on politics that they didn’t get the act together at the end,” he told <em>Breitbart</em>, as if the PricewaterhouseCoopers accountant who <a href=\"https://www.nytimes.com/2017/02/27/business/media/pwc-oscars-best-picture.html\">handed Warren Beatty the wrong envelope</a> did so because he’d been cackling too hard at Kimmel <a href=\"https://www.theatlantic.com/liveblogs/2017/02/2017-oscars/517761/14940/\">tweeting</a> the president “u up?”  </p>\r\n\r\n<p>Liberals may groan at Trump taking credit for his critics making a logistical mistake. But, of course, both sides see a lot of politics in entertainment these days: See <a href=\"http://www.newyorker.com/culture/cultural-comment/did-the-oscars-just-prove-that-we-are-living-in-a-computer-simulation\">all the takes</a> making like Doocy and comparing the end of the Oscars to election night.</p>\r\n\r\n<p>To many viewers on Sunday, Davis’s speech seemed remarkable for how it nearly transcended partisan fray and just passionately talked about acting. But one word—“only”—was enough to make her a culture-war litmus test. Maybe she wanted to pick a fight about art’s place in society, or maybe she was simply portraying her profession as she genuinely sees it. Either way, it was a defiant move in an era where artists are increasingly held to the same standards as candidates for office: expected to choose their words not for truth but for politics.</p>\r\n",
                "contentSnippet": "Yesterday I praised Viola Davis’s Oscars speech for being memorable without being explicitly political—for simply talking about her job in a moving and well-written way. Twitter quickly let me know I missed something. On social media and conservative-leaning news sites, Davis’s speech had in fact sparked outrage.\n\r\n\r\nAfter explaining that she felt her mission was to “exhume … the stories of the people who dreamed big and never saw those dreams to fruition, people who fell in love and lost,” Davis said this:\n\r\n\r\n\r\nI became an artist—and thank God I did—because we are the only profession that celebrates what it means to live a life.\n\r\n\r\n\r\n\r\n\r\nThis claim has become one of the discussion items of the right-wing internet following the Oscars ceremony. “Art is wonderful; art is enriching; art can connect us with each other,” writes Ben Shapiro at Daily Wire. “But the utter arrogance of stating that artists are ‘the only profession that celebrates what it means to live a life’ is astounding. How about doctors? How about stay-at-home mothers, who help shape lives rather than pursuing their own career interests? How about morticians? How about pretty much everybody in a free market economy, giving of themselves to others to improve lives?”\n\r\n\r\nVariants of that sentiment have ricocheted online, with Davis sometimes misquoted as though she’d said only “actors” celebrate what it means to live a life, or, worse, are the only ones who “know” what it means to live a life.\n\r\n\r\nAre people right to be offended? Did she say artists are better than anyone else? Reading her words literally, within the context of her speech, and extending her the slightest benefit of the doubt, it’s hard to see backlash against Davis as anything other than a symptom of our overblown culture wars.\n\r\n\r\nAnyone might “celebrate what it means to live a life” in their own personal ways, but for whom is that a primary function of their profession? Artists, definitely. Clergy, maybe. Doctors save lives rather than celebrating them, and it doesn’t denigrate them to say so. Stay-at-home parents help others, and Davis might even agree that that’s more noble, important, and essential than “celebrating” the meaning of life.\n\r\n\r\nHer point was simply that artists serve a specific role in telling stories about the human experience, and that she’s glad she’s a part of that.\n\r\n\r\nCertainly, she could have edited herself to make a less controversial, though arguably less interesting, statement. If she’d simply said, “I became an artist—and thank God I did—because we celebrate what it means to live a life,” complaints may have been harder to come by. The “only” highlights a specific way that artists are special, but it also is a dogwhistle to anyone holding strong resentment about Hollywood elitism and condescension. And there’s rarely been a better time to air such resentment than right now.\n\r\n\r\nArtists are now treated like candidates—expected to choose their words not for truth but for politics.\r\n\r\nOn the right, reflexive disgust for the entertainment industry has taken on new fervor under Donald Trump. During the Fox and Friends after the Oscars, the snafu whereby La La Land mistakenly was announced as Best Picture was spun by Steve Doocy as, “Hollywood got the election wrong, and last night Hollywood got the Oscars wrong.” Guest Tucker Carlson agreed but added that Moonlight “had to win” because the moralizing, politically correct establishment willed it to. Yes, the Oscars were both an out-of-touch catastrophe and an insidiously rigged game.\n\r\n\r\nDonald Trump has given his own interpretation of the Academy’s screwup: “I think they were focused so hard on politics that they didn’t get the act together at the end,” he told Breitbart, as if the PricewaterhouseCoopers accountant who handed Warren Beatty the wrong envelope did so because he’d been cackling too hard at Kimmel tweeting the president “u up?”  \n\r\n\r\nLiberals may groan at Trump taking credit for his critics making a logistical mistake. But, of course, both sides see a lot of politics in entertainment these days: See all the takes making like Doocy and comparing the end of the Oscars to election night.\n\r\n\r\nTo many viewers on Sunday, Davis’s speech seemed remarkable for how it nearly transcended partisan fray and just passionately talked about acting. But one word—“only”—was enough to make her a culture-war litmus test. Maybe she wanted to pick a fight about art’s place in society, or maybe she was simply portraying her profession as she genuinely sees it. Either way, it was a defiant move in an era where artists are increasingly held to the same standards as candidates for office: expected to choose their words not for truth but for politics.",
                "summary": "In another strange sign of the mounting culture wars, Viola Davis’s emotional Oscars tribute to artists has become political fodder.",
                "id": "tag:thewire.com,2017:50-518082",
                "isoDate": "2017-02-28T17:57:00.000Z"
            }
        ]
    }

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

        // this.feeds.push(url);
        // return { message: 'Feed added successfully', feeds: this.feeds };
        return this.feedModel.create({ url });
    }

    // Fetch feeds and save articles
    async fetchFeeds(): Promise<void> {
        const existingFeed = await this.feedModel.find({});
        let count1 = 0;
        for (const feedUrl of existingFeed) {
            try {
                const feed = await this.rssParser.parseURL(feedUrl?.url);
                // console.log('feed:::', feed);

                count1++;
                let count2 = 0;
                for (const item of feed.items) {
                    const article = {
                        title: item.title,
                        description: item.contentSnippet,
                        publicationDate: new Date(item.pubDate),
                        sourceUrl: item.link,
                    };
                    count2++;
                    console.log(`article ${count1}-${count2}:::`, article);

                    await this.articleService.saveArticle(article);
                }

                // const article = {
                //     title: feed.items[0].title,
                //     description: feed.items[0].contentSnippet,
                //     publicationDate: new Date(feed.items[0].pubDate),
                //     sourceUrl: feed.items[0].link,
                // };
                // await this.articleService.saveArticle(article);

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
