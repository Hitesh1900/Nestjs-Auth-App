import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
  private twitterClient: TwitterApi;

  constructor(private configService: ConfigService) {
    this.twitterClient = new TwitterApi({
      appKey: this.configService.get('TWITTER_CONSUMER_KEY'),
      appSecret: this.configService.get('TWITTER_CONSUMER_SECRET'),
      accessToken: this.configService.get('TWITTER_ACCESS_TOKEN'),
      accessSecret: this.configService.get('TWITTER_ACCESS_SECRET'),
    });
  }

  async uploadMedia(mediaBuffer: Buffer, mimeType: string): Promise<string> {
    const mediaId = await this.twitterClient.v1.uploadMedia(mediaBuffer, { mimeType });
    return mediaId;
  }

  async postTweetWithMedia(status: string, mediaIds: string[]): Promise<any> {
    return this.twitterClient.v1.tweet(status, { media_ids: mediaIds });
  }
}
