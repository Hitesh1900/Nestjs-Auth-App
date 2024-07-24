import { Controller, Post, UseGuards, Req, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {Multer} from 'multer';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tweet')
  @UseInterceptors(FilesInterceptor('media')) 
  async postTweet(
    @Req() req,
    @Body() body: { status: string },
    @UploadedFiles() media: Express.Multer.File[],
  ) {
    const mediaIds = [];
    if (media && media.length > 0) {
      for (const file of media) {
        const mediaBuffer = file.buffer;
        const mediaId = await this.twitterService.uploadMedia(mediaBuffer, file.mimetype);
        mediaIds.push(mediaId);
      }
    }
    return this.twitterService.postTweetWithMedia(body.status, mediaIds);
  }
}
