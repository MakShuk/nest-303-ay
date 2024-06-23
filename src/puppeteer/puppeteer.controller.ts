import { Controller, Get} from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';


@Controller('puppeteer')
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}
  @Get()
  findAll() {
    return this.puppeteerService.findAll();
  }
}
