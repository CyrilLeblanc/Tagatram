import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  map: Leaflet.Map;

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadMap();
  }

  ngOnDestroy() {
    this.map.remove();
  }

  loadMap() {
    this.map = Leaflet.map('map').setView([45.1709, 5.7395], 12);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);
  }
}
