import * as CryptoJS from 'crypto-js';

export class StorageSecurity {

  private static readonly SECRET = 'APP_STORAGE_2026';

  static encrypt(data: any): string {

    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.SECRET
    ).toString();

  }

  static decrypt(value: string): any {

    if (!value) {
      return null;
    }

    // AES
    try {

      const bytes = CryptoJS.AES.decrypt(
        value,
        this.SECRET
      );

      const decrypted = bytes.toString(
        CryptoJS.enc.Utf8
      );

      if (decrypted) {
        return JSON.parse(decrypted);
      }

    } catch {}

    // Compatibilidad Base64
    try {

      return JSON.parse(atob(value));

    } catch {}

    return null;
  }

  static saveData(data: any): void {

    localStorage.setItem(
      'Data',
      this.encrypt(data)
    );

  }

  static getData(): any {

    const value = localStorage.getItem('Data');

    return this.decrypt(value || '');

  }
}