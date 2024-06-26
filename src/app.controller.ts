import { Body, Controller, Get, Res, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ParseShortPageDto, ShortDescriptionDto } from './app-dto';
import { LoggerService } from './service/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get('one-short-description')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async start(@Body() body: ShortDescriptionDto): Promise<any> {
    this.logger.info('start');
    const query = body.query as unknown as string;
    console.log('query', query);
    const screenshotStatus = await this.appService.getOneShort(query);
    if ('errorMessage' in screenshotStatus) {
      return { errorMessage: screenshotStatus.errorMessage };
    } else {
      return { data: screenshotStatus.data };
    }
  }
}
