import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public languages = [
    { name: 'Français', class: 'french' },
    { name: 'English', class: 'english' }
  ];

  public themeColor = [
    { name: 'Clair', class: 'light' },
    { name: 'Sombre', class: 'dark' }
  ];

  public mainPage = [
    { name: 'Carte', class: 'map' },
    { name: 'Favoris', class: 'favorites' },
    { name: 'Itinéraire', class: 'route' },
    { name: 'Lignes', class: 'lines' }
  ];

  selectTheme = String(document.querySelector('.selectThemeOption'));
  public dynamicTheme() {
    switch (this.selectTheme) {
      case "light": 
        window.matchMedia('(prefers-color-scheme: light)');
        break;
      case "dark":
        window.matchMedia('(prefers-color-scheme: dark)');
        break;
    }
  }

  selectMainPage = String(document.querySelector('.selectMainPage'));
  public dynamicMainPage() {
    switch (this.selectMainPage) {
      case "map":
      case "favorites":
      case "route":
      case "lines":
    }
  }

}
