# News Aggregator

A backend application built using **NestJS** and **MongoDB** that functions as a news aggregator. It fetches articles from configurable RSS feed URLs, persists the data, extracts topics, and provides additional functionalities for filtering and analyzing news articles.

---

## Technology Stack
- **Framework**: NestJS
- **Database**: MongoDB
- **RSS Parsing**: `rss-parser` (Node.js)
- **Topic Extraction**: OpenAI or AWS Comprehend

---

## Features

### 1. Fetch Data
- Configure a list of RSS feed URLs for various news sources.
- Retrieve news articles from these RSS feeds using the `rss-parser` library.
- Handle potential errors during data retrieval, such as invalid URLs or network issues.

### 2. Persist Data
- Store fetched news articles in MongoDB.
- Data schema includes the following fields:
  - Title
  - Description
  - Publication Date
  - Source URL
  - Extracted Topics

### 3. Topic Extraction
- Extract topics from the text content of news articles.
- Use OpenAI's GPT models or AWS Comprehend for topic extraction.
- Store extracted topics along with the corresponding article in the database.

### 4. Additional Functionalities (Bonus)
- Filter articles based on keywords or publication dates.
- Identify and store named entities (e.g., people, locations, organizations as text, type, score) using AWS Comprehend or OpenAI.
- Schedule periodic fetching and processing of new articles.

---

## Installation

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB instance running.
- Environment variables for mongodb, AWS credentials or OpenAI API key configured.

### Steps
- Clone the repository:
   ```bash
   git clone https://github.com/ShahrearKabir/news-aggregator.git
   cd news-aggregator
   ```

- Install dependencies:
   ```bash
   # go to project dir

   $ cp .env.example .env
   $ npm install
   ```

- Configure environment variables:
   ```plaintext
   NAME=news-aggregator
   RUN_TIME=
   PORT=

   MONGO_DB_URL=

   OPENAI_API_KEY=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_REGION=
   ```

- Start the application:
   ```bash
   npm run start:dev
   ```

---

## API Endpoints

### Feeds Management
- **POST /feeds**: Add a new RSS feed URL.
  ```json
  {
    "url": "https://rss.cnn.com/rss/cnn_topstories.rss"
  }
  ```
- **GET /feeds**: Retrieve all configured RSS feed URLs.
- **POST /feeds/fetch**: Add a new RSS feed from saved URLs in feed.

### Articles Management
- **GET /articles**: Retrieve articles with optional filters.
  - Query Params: `keyword`, `startDate`, `endDate`
- **GET /articles/:id**: Retrieve a specific article by ID.

### Topic Extraction
- Topics are automatically extracted when articles are fetched and stored.

---

## Database Schemas

### Feed Schema
```typescript
{
  _id: ObjectId,
  title?: string,
  url: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Article Schema
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  publicationDate: Date,
  sourceUrl: string,
  topics: string[],
  entities: {
    text: string,
    type: string,
    score: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Approach

### Fetching Data
- Used the `rss-parser` library to fetch and parse RSS feeds.
- Implemented error handling for invalid URLs and network errors.

### Storing Data
- Designed MongoDB schemas for `Feed` and `Article` collections.
- Ensured data integrity by avoiding duplicate articles from the same source.

### Topic Extraction
- Integrated with OpenAI or AWS Comprehend APIs for topic extraction.
- Stored extracted topics and entities alongside the articles.

### Scheduling
- Used NestJS `@nestjs/schedule` package to periodically fetch and process new articles.

---