import { Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { PuppeteerController } from './puppeteer.controller';
import { LoggerService } from 'src/service/logger/logger.service';

const loggerServiceProvider = {
  provide: LoggerService,
  useValue: new LoggerService('puppeteer'),
};

@Module({
  controllers: [PuppeteerController],
  providers: [PuppeteerService, loggerServiceProvider],
  exports: [PuppeteerService],  
})
export class PuppeteerModule {}
