import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ValidationPipe } from '@nestjs/common';
import { ShortAllDescriptionDto, ShortDescriptionDto } from './app-dto';
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
    this.logger.info('one-short-description');
    const reqStatus = await this.appService.getOneShort(body.query);
    if ('errorMessage' in reqStatus) {
      throw new HttpException(
        `${reqStatus.errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return { data: reqStatus.data };
    }
  }

  @Get('all-short-descriptions')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async startAll(@Body() body: ShortAllDescriptionDto): Promise<any> {
    this.logger.info('all-short-descriptions');
    const reqStatus = await this.appService.getAllShort(body.query);
    if ('errorMessage' in reqStatus) {
      throw new HttpException(
        `${reqStatus.errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return { data: reqStatus.data };
    }
  }
}
