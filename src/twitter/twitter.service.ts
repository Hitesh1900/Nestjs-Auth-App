import { Injectable } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterService {
  private twitterClient: TwitterApi;

  constructor(private configService: ConfigService) {
    this.twitterClient = new TwitterApi({
      appKey: this.configService.get<string>('TWITTER_CONSUMER_KEY'),
      appSecret: this.configService.get<string>('TWITTER_CONSUMER_SECRET'),
      accessToken: this.configService.get<string>('TWITTER_ACCESS_TOKEN'),
      accessSecret: this.configService.get<string>('TWITTER_ACCESS_SECRET'),
    });
  }

  async postTweet(status: string): Promise<any> {
    return this.twitterClient.v2.tweet(status);
  }
}
