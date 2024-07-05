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
  async start(@Body() body: ShortDescriptionDto) {
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
  async startAll(@Body() body: ShortAllDescriptionDto) {
    this.logger.info('all-short-descriptions');
    const reqStatus = await this.appService.getAllShort(body.urls);
    if ('errorMessage' in reqStatus) {
      throw new HttpException(
        `${reqStatus.errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return { data: reqStatus.data };
    }
  }

  @Get('short-description-for-parser')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async ShortDescriptionFotParser(
    @Body()
    body: {
      originalTitle: string;
      imageUrl: string;
      originalUrl: string;
      resourceId: number;
      title: string;
      content: string;
      summaryUrl: string;
    },
  ) {
    this.logger.info('Запрос на получение краткого описания для парсера');
    const { originalTitle, imageUrl, originalUrl, resourceId } = body;
    const reqStatus = await this.appService.getOneShort(originalUrl);
    if ('errorMessage' in reqStatus) {
      this.logger.error('Ошибка при запросе краткого описания для парсера');
      throw new HttpException(
        `${reqStatus.errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const { title, content, summaryUrl } = reqStatus.data;
      const fullData = {
        originalTitle,
        imageUrl,
        originalUrl,
        resourceId,
        title,
        content,
        summaryUrl,
      };
      return { data: fullData };
    }
  }
}
