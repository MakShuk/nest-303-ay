import { Injectable } from '@nestjs/common';
import { LoggerService } from './service/logger/logger.service';
import { PuppeteerService } from './puppeteer/puppeteer.service';
import { isURL } from 'class-validator';

type CheckType = {
  data?: string;
  errorMessage?: string;
};

@Injectable()
export class AppService {
  constructor(
    private readonly log: LoggerService,
    private readonly browser: PuppeteerService,
  ) {}

  async getOneShort(query: string) {
    try {
      await this.browser.browserAction('start');
      await this.browser.goto('https://300.ya.ru/');

      const authorizationStatus = await this.checkAuthorization();
      if ('errorMessage' in authorizationStatus) {
        await this.authorization();
      }

      const requestStatus = await this.requestToPage(query);
      if ('errorMessage' in requestStatus) {
        throw new Error(`Ошибка запроса --> ${requestStatus.errorMessage}`);
      }

      await this.browser.browserAction('close');
      return { data: requestStatus.data };
    } catch (error) {
      const errorMessage = `Error start --> ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage: errorMessage };
    }
  }

  async getPageData(isUrl: boolean) {
    const titleSelector = 'h1';
    const contentSelector = 'li';
    const checkButtonSelector = 'span.text';
    try {
      let title = '';
      if (isUrl) {
        title = await this.browser.page.$eval(titleSelector, (element) =>
          element.textContent.trim(),
        );
      }

      this.log.info(`Заголовок: ${title}`);

      if (title.includes(`Что-то пошло не так. Попробуйте еще`)) {
        throw new Error(
          `Попробуйте еще раз или выберите другой источник пересказа`,
        );
      }

      await this.browser.page.waitForSelector(checkButtonSelector, {
        timeout: 15000,
      });

      const content = await this.browser.page.$$eval(
        contentSelector,
        (elements) =>
          elements.map((element) => element.textContent.trim().substring(2)),
      );

      const link = this.browser.page.url();

      return { data: { title, content, link } };
    } catch (error) {
      const errorMessage = `--> getPageData: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage };
    }
  }

  private async requestToPage(query: string) {
    try {
      const requestStatus = await this.sendRequest(query);

      if ('errorMessage' in requestStatus) {
        throw new Error(
          `Ошибка отправки запроса --> ${requestStatus.errorMessage}`,
        );
      }

      const getPageDataStatus = await this.getPageData(isURL(query));
      if ('errorMessage' in getPageDataStatus) {
        throw new Error(
          `Ошибка получения данных со страницы --> ${getPageDataStatus.errorMessage}`,
        );
      }
      return { data: getPageDataStatus.data };
    } catch (error) {
      const errorMessage = `--> requestToPage: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage };
    }
  }

  private async checkUrlFor15Seconds(): Promise<CheckType> {
    try {
      return new Promise((resolve) => {
        const endTime = Date.now() + 1000 * 15;
        const checkInterval = 1000;

        const checkUrl = async () => {
          if (Date.now() >= endTime) {
            this.log.error('Время проверки истекло.');
            resolve({ errorMessage: 'Время проверки истекло.' });
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
      const errorMessage = `--> checkUrlFor15Seconds: ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage: errorMessage };
    }
  }

  private async authorization() {
    try {
      await this.browser.page.locator('.login').click();
      await this.browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
      await this.browser.page
        .locator('#passp-field-login')
        .fill(process.env.YA_LOGIN);
      await this.browser.page.locator(`#passp\\:sign-in`).click();
      await this.browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
      await this.browser.page
        .locator(`#passp-field-passwd`)
        .fill(process.env.YA_PASSWORD);
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
      const errorMessage = `--> authorization: ${error.message}`;
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
      const errorMessage = `--> checkAuthorization: ${error.message}`;
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
      const errorMessage = `sendRequest --> ${error.message}`;
      this.log.error(errorMessage);
      return { errorMessage };
    }
  }
}
