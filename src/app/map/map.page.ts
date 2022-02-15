import { LineSchedule } from './../interfaces/line-schedule';
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
  overlays: { [key: string]: Leaflet.layerGroup } = {
    stops: [],
  };

  constructor(private api: ApiMetromobiliteService) {}

  ngOnDestroy() {
    this.map.remove();
  }
  ngOnInit() {}

  async ionViewDidEnter() {
    // load the map
    this.map = Leaflet.map('map').setView([45.1709, 5.7395], 12);
    Leaflet.tileLayer(
      'https://data.mobilites-m.fr/carte-dark/{z}/{x}/{y}.png'
    ).addTo(this.map);

    // display tram lines
    (await this.api.getTramLineList()).forEach(async (line: Line) => {
      this.overlays[line.id] = Leaflet.layerGroup([
        Leaflet.polyline(
          (await this.api.getLineDescription(line.id)).features[0].geometry
            .coordinates[0],
          {
            weight: 5,
            color: `#${line.color}`,
          }
        ),
      ]);
      this.map.addLayer(this.overlays[line.id]);
      this.loadStops();
    });
    this.handleDisplayStops();
  }

  /**
   * Fetch stops from the API
   */
  async loadStops() {
    Object.entries(this.overlays).forEach(async ([key, value]) => {
      if (key !== 'stops') {
        this.api
          .getLineSchedule(key)
          .then(async (lineSchedule: LineSchedule) => {
            lineSchedule['0'].arrets.forEach((stop) => {
              this.overlays.stops.push(
                Leaflet.circleMarker([stop.lat, stop.lon], {
                  radius: 13,
                  color: '#000',
                  fillColor: '#fff',
                  fillOpacity: 1,
                  title: stop.stopName,
                })
                  .bindPopup(stop.stopName)
                  .on('click', () => {
                    this.map.setView([stop.lat, stop.lon], 15);
                  })
              );
            });
          });
      }
    });
  }

  /**
   * Display stops on the map or hide them if visible
   */
  handleDisplayStops() {
    this.map.on('moveend', async () => {
      for (let stop of this.overlays.stops) {
        if (
          !this.map.getBounds().contains(stop.getLatLng()) ||
          this.map.getZoom() <= 13
        ) {
          this.map.removeLayer(stop);
        } else {
          this.map.addLayer(stop);
        }
      }
    });
  }
}
