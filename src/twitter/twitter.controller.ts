import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tweet')
  async postTweet(@Body('status') status: string) {
    return this.twitterService.postTweet(status);
  }
}
