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
import {
  ParserRequestDto,
  ShortAllDescriptionDto,
  ShortDescriptionDto,
} from './app-dto';
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
    @Body() body: ParserRequestDto,
  ): Promise<any> {
    this.logger.info('Запрос на получение краткого описания для парсера');
    const reqStatus = await this.appService.getOneShort(body.originalUrl);
    if ('errorMessage' in reqStatus) {
      this.logger.error('Ошибка при запросе краткого описания для парсера');
      throw new HttpException(
        `${reqStatus.errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      this.logger.info('Ответ на запрос краткого описания для парсера');
      return { data: reqStatus.data };
    }
  }
}
