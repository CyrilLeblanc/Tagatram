import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LineSchedule } from './../interfaces/line-schedule';
import { Line } from './../interfaces/line';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Leaflet from 'leaflet';

import { StopComponent } from '../stop/stop.component';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  map: Leaflet.Map;
  searchbar: string = '';
  overlays: { [key: string]: Leaflet.layerGroup } = {
    stops: [],
  };

  constructor(
    private api: ApiMetromobiliteService,
    private geolocation: Geolocation,
    private modalController: ModalController
  ) {}

  ngOnDestroy() {
    this.map.remove();
  }

  ngOnInit() {}

  async ionViewDidEnter() {
    // return if map is already loaded
    if (this.map) return;

    // load the map
    this.map = Leaflet.map('map').setView([45.1709, 5.7395], 12);
    /* Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo(this.map); */
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

    this.map.on('moveend', async () => {
      this.handleDisplayStops();
    });
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
                }).on('click', () => {
                  this.map.setView([stop.lat, stop.lon], 15);
                  this.displayModal();
                })
              );
            });
          });
      }
    });
  }

  /**
   * Display stops on the map or hide them if not visible in bounds
   * but will display if searchbar is not empty
   */
  handleDisplayStops(force: boolean = false) {
    for (let stop of this.overlays.stops) {
      if (
        this.map.getBounds().contains(stop.getLatLng()) &&
        (this.map.getZoom() >= 13 || force)
      ) {
        this.map.addLayer(stop);
      } else {
        this.map.removeLayer(stop);
      }
    }
  }

  /**
   * set the map view to the current position update it every second
   */
  locate() {
    if (
      this.overlays.position === undefined &&
      this.overlays.accuracy === undefined
    ) {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.overlays.position = Leaflet.circleMarker(
          [resp.coords.latitude, resp.coords.longitude],
          {
            radius: 13,
            fillOpacity: 1,
            title: 'Vous êtes ici',
          }
        ).addTo(this.map);
        // add a circle to show the accuracy of location
        this.overlays.accuracy = Leaflet.circle(
          [resp.coords.latitude, resp.coords.longitude],
          {
            color: '#000',
            fillColor: '#fff',
            fillOpacity: 0.1,
            radius: resp.coords.accuracy,
          }
        ).addTo(this.map);
      });
      this.geolocation
        .watchPosition()
        .subscribe((resp: GeolocationPosition) => {
          this.overlays.position.setLatLng([
            resp.coords.latitude,
            resp.coords.longitude,
          ]);
          this.overlays.accuracy.setLatLng([
            resp.coords.latitude,
            resp.coords.longitude,
          ]);
          this.overlays.accuracy.setRadius(resp.coords.accuracy);
        });
    } else {
      this.map.fitBounds(this.overlays.accuracy.getBounds());
    }
  }

  searchUpdate(value: string) {
    this.overlays.stops.forEach((stop) => {
      // set opacity to 0 if the stop title does not match the searchbar
      let opacity: number = stop.options.title
        .toLowerCase()
        .includes(value.toLowerCase())
        ? 1
        : 0.05;
      stop.setStyle({ fillOpacity: opacity, opacity: opacity });
    });
    this.handleDisplayStops(value.length !== 0);
  }

  async displayModal(title: string = '') {
    const modal = await this.modalController.create({
      component: StopComponent,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
      componentProps: {
        title: title,
        stop: this.overlays.stops[0],
      },
    });
    await modal.present();
  }
}
