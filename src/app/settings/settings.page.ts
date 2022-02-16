import { Component, OnInit } from '@angular/core';
import { ThemeChangerService } from '../services/theme-changer.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private themeChangerService: ThemeChangerService) {}

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

  selectLanguage = String(document.getElementsByClassName('selectLanguage'));
  dynamicLanguage() {
    switch (this.selectLanguage) {
      case "french": 
        break;
      case "english": 
        break;
    }
  }

  selectTheme = String(document.getElementsByClassName('selectThemeOption'));
  public dynamicTheme() {
    switch (this.selectTheme) {
      case "light": 
        this.themeChangerService.setTheme("light");
        break;
      case "dark":
        this.themeChangerService.setTheme("dark");
        break;
    }
  }

  selectMainPage = String(document.getElementsByClassName('selectMainPage'));
  public dynamicMainPage() {
    switch (this.selectMainPage) {
      case "map": 
        break;
      case "favorites": 
        break;
      case "route": 
        break;
      case "lines": 
        break;
    }
  }

}
