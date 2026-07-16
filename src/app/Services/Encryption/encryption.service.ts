import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private readonly KEY = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012');
  private readonly IV = CryptoJS.enc.Utf8.parse('1234567890123456');


  encrypt(data: any): string {

    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, this.KEY, {
      iv: this.IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  decrypt(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.KEY, {
      iv: this.IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

}