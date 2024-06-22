import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './service/logger/logger.service';

const loggerServiceProvider = {
  provide: LoggerService,
  useValue: new LoggerService('app'),
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, loggerServiceProvider],
})
export class AppModule {}
