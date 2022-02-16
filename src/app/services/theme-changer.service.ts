import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root',
})
export class ThemeChangerService {
  private theme: string = 'light';

  constructor(private storage: Storage) {
    this.storage.create();
    this.storage.get('theme').then((val) => {
      this.setTheme(val ? val : 'light');
    });
  }

  setTheme(temp: string) {
    this.theme = temp;
    this.storage.set('theme', temp);
  }

  getTheme(): string {
    return this.theme;
  }
}
