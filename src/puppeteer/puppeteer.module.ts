import { Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { LoggerService } from 'src/service/logger/logger.service';

const loggerServiceProvider = {
  provide: LoggerService,
  useValue: new LoggerService('puppeteer'),
};

@Module({
  controllers: [],
  providers: [PuppeteerService, loggerServiceProvider],
  exports: [PuppeteerService],
})
export class PuppeteerModule {}

