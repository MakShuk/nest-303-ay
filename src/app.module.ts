import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './service/logger/logger.service';
import { PuppeteerModule } from './puppeteer/puppeteer.module';

const loggerServiceProvider = {
  provide: LoggerService,
  useValue: new LoggerService('app'),
};

@Module({
  imports: [PuppeteerModule],
  controllers: [AppController],
  providers: [AppService, loggerServiceProvider],
})
export class AppModule {}
