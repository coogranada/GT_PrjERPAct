import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


declare global {
  interface Window {
    grecaptcha: {
      ready(callback: () => void): void;
      execute(
        siteKey: string,
        options: { action: string }
      ): Promise<string>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  private siteKey = environment.recaptchaSiteKey;

  async execute(action: string): Promise<string> {
    return new Promise((resolve, reject) => {

      if (!window.grecaptcha) {
        reject('Google reCAPTCHA no está disponible');
        return;
      }

      window.grecaptcha.ready(() => {

        window.grecaptcha.execute(
          this.siteKey,
          { action }
        ).then(token => {
          resolve(token);
        }).catch(error => {
          reject(error);
        });

      });

    });
  }
}