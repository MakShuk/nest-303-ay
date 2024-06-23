import { Injectable } from '@nestjs/common';
import { LoggerService } from './service/logger/logger.service';
import { PuppeteerService } from './puppeteer/puppeteer.service';

@Injectable()
export class AppService {
  constructor(
    private readonly log: LoggerService,
    private readonly browser: PuppeteerService,
  ) {}

  async start(query: string): Promise<any> {
    try {
      await this.browser.browserAction('start');
      await this.browser.goto('https://300.ya.ru/');

      const authorizationStatus = await this.checkAuthorization();
      if ('errorMessage' in authorizationStatus) {
        await this.authorization();
      }

      const requestStatus = await this.sendRequest(query);

      if ('errorMessage' in requestStatus) {
        /* throw new Error(
          `Ошибка отправки запроса: ${requestStatus.errorMessage}`,
        ); */
      }

      const screenshot = await this.browser.page.screenshot();
      await this.browser.browserAction('close');
      return { data: screenshot };
    } catch (error) {
      const errorMessage = `Error start: ${error.message}`;
      this.log.error(errorMessage);
      return { error: errorMessage };
    }
  }

  private async checkUrlFor15Seconds(): Promise<{
    data?: string;
    errorMassage?: string;
  }> {
    try {
      return new Promise((resolve) => {
        const endTime = Date.now() + 1000 * 15;
        const checkInterval = 1000;

        const checkUrl = async () => {
          if (Date.now() >= endTime) {
            this.log.error('Время проверки истекло.');
            resolve({ errorMassage: 'Время проверки истекло.' });
            return;
          }

          const currentUrl = this.browser.page.url();
          if (/^https:\/\/300\.ya\.ru\//.test(currentUrl)) {
            this.log.info('Адрес страницы верный.');
            resolve({ data: 'Адрес страницы верный.' });
            return;
          } else {
            console.log('Адрес страницы не соответствует ожидаемому.');
          }

          setTimeout(checkUrl, checkInterval);
        };

        checkUrl();
      });
    } catch (error) {
      const errorMessage = `Error checkUrlFor15Seconds: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMassage: errorMessage };
    }
  }

  private async authorization() {
    try {
      await this.browser.page.locator('.login').click();
      await this.browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
      await this.browser.page.locator('#passp-field-login').fill('ya303m');
      await this.browser.page.locator(`#passp\\:sign-in`).click();
      await this.browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
      await this.browser.page.locator(`#passp-field-passwd`).fill('ON1kqSiUJ');
      await this.browser.page.locator(`#passp\\:sign-in`).click();
      await this.browser.page.waitForNavigation({ waitUntil: 'networkidle2' });
      const checkStatus = await this.checkUrlFor15Seconds();

      if ('errorMassage' in checkStatus) {
        throw new Error(
          `Ошибка ожидания редиректа после авторизации: ${checkStatus.errorMassage}`,
        );
      }
      return { data: 'Авторизация прошла успешно.' };
    } catch (error) {
      const errorMessage = `Error authorization: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage };
    }
  }

  private async checkAuthorization() {
    try {
      const data = await this.browser.page.waitForSelector(
        '.svelte-1on2f8 > a > img',
        { timeout: 10000 },
      );
      return { data: 'Пользователь авторизован.' };
    } catch (error) {
      const errorMessage = `Error checkAuthorization: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage };
    }
  }

  private async sendRequest(request: string) {
    try {
      const textarea = await this.browser.page.waitForSelector('textarea');
      await textarea.type(request);
      await textarea.press('Enter');
      await this.browser.page.waitForNavigation({
        waitUntil: 'networkidle0',
      });
      return { data: `` };
    } catch (error) {
      const errorMessage = `Error sendRequest: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage };
    }
  }
}
