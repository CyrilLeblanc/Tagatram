import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeChangerService {

  private theme: string = 'dark';

  constructor() { }

  setTheme(temp: string) {
    this.theme = temp;
  }

  getTheme(): string {
    return this.theme;
  }

}
