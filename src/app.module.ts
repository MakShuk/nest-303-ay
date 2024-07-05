import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './service/logger/logger.service';
import { ConfigModule } from '@nestjs/config';
import { PuppeteerService } from './service/puppeteer/puppeteer.service';

const loggerServiceProvider = {
  provide: LoggerService,
  useValue: new LoggerService('app'),
};

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, loggerServiceProvider, PuppeteerService],
})
export class AppModule {}
