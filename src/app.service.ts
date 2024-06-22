import { Injectable } from '@nestjs/common';
import { LoggerService } from './service/logger/logger.service';


@Injectable()
export class AppService {
  constructor(private readonly log: LoggerService) { }
  
  getHello(): string {
    this.log.info('Hello World!');
    return 'Hello World!';
  }
}
