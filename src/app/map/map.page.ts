import { Line } from './../interfaces/line';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  map: Leaflet.Map;

  constructor(private api: ApiMetromobiliteService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadMap();
  }

  ngOnDestroy() {
    this.map.remove();
  }

  async loadMap() {
    this.map = Leaflet.map('map').setView([45.1709, 5.7395], 12);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    // display tram line
    (await this.api.getTramLineList()).forEach(async (line: Line) => {
      Leaflet.polyline((await this.api.getLineDescription(line.id)).features[0]
      .geometry.coordinates[0], {
        weight: 5,
        color: `#${line.color}`,
      }).addTo(this.map);
    });
  }
}
