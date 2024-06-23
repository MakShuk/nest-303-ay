import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, query } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async start(
    @Res() res: Response,
    @Body() body: { query: string },
  ): Promise<any> {
    const screenshotStatus = await this.appService.start(body.query);
    if ('errorMessage' in screenshotStatus) {
      res.status(500).send(screenshotStatus.errorMessage);
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline; filename="1.jpg"');
    res.send(screenshotStatus.data);
  }
}
