import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/service/logger/logger.service';
import puppeteer, { Browser, Cookie, Page } from 'puppeteer';
import * as fs from 'fs/promises';

@Injectable()
export class PuppeteerService {
  constructor(private readonly log: LoggerService) {}
  browser: Browser;
  page: Page;



  async browserAction(action: 'start' | 'close') {
    try {
      if (action === 'start') {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.loadCookie();
      } else if (action === 'close') {
        await this.saveCookie();
        await this.browser.close();
      }
      return { data: 'Browser started' };
    } catch (error) {
      const errorMessage = `Error browser: ${error.message}`;
      this.log.error(errorMessage);
      return { error: errorMessage };
    }
  }

  async goto(url: string) {
    try {
      await this.page.setViewport({ width: 1080, height: 1024 });
      await this.page.goto(url);
      return { data: 'Page loaded' };
    } catch (error) {
      const errorMessage = `Error goto: ${error.message}`;
      this.log.error(errorMessage);
      return { error: errorMessage };
    }
  }

  async screenshot() {
    try {
      const screenshot = await this.page.screenshot();
      return { data: screenshot };
    } catch (error) {
      const errorMessage = `Error screenshot: ${error.message}`;
      this.log.error(errorMessage);
      return { error: errorMessage };
    }
  }

  private async saveCookie() {
    try {
      const fileName = 'cookie.json';
      const cookies = await this.page.cookies();
      const cookieJson = JSON.stringify(cookies, null, 2);
      await fs.writeFile(fileName, cookieJson);
      return {
        data: `cookies записаны в ${fileName}`,
      };
    } catch (error) {
      const errorMessage = `Error saveCookie: ${error.message}`;
      this.log.error(errorMessage);
      return null;
    }
  }

  private async loadCookie() {
    try {
      const fileName = 'cookie.json';
      const data = await fs.readFile(fileName, { encoding: 'utf-8' });
      const cookies = JSON.parse(data) as Cookie[];
      await this.page.setCookie(...cookies);
      return {
        data: `cookies прочитаны из ${fileName}`,
      };
    } catch (error) {
      const errorMessage = `Error loadCookie: ${error.message}`;
      this.log.error(errorMessage);
      return null;
    }
  }
}
