import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ThemeChangerService } from './../services/theme-changer.service';
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
export class MapPage {
  locationEnabled = false;
  map: Leaflet.Map;
  searchbar: string = '';
  overlays: { [key: string]: Leaflet.layerGroup } = {
    clusters: [],
  };
  layer: { [key: string]: Leaflet.tileLayer } = {};
  lines: Line[] = [];

  constructor(
    private api: ApiMetromobiliteService,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private themeChanger: ThemeChangerService
  ) {}

  async loadMap() {
    if (!this.map) {
      this.map = Leaflet.map('map').setView([45.1709, 5.7395], 12);
      this.map.zoomControl.remove();

      this.layer.tag.addTo(this.map);

      this.map.on('moveend', async () => {
        this.handleDisplayClusters();
      });

      return true;
    }
  }

  updateTheme() {
    if (this.map) this.map.removeLayer(this.layer.tag);
    this.layer.tag = Leaflet.tileLayer(
      `https://data.mobilites-m.fr/carte${
        this.themeChanger.getTheme() === 'dark' ? '-dark' : ''
      }/{z}/{x}/{y}.png`
    );
    if (this.map) this.map.addLayer(this.layer.tag);
  }

  async ionViewDidEnter() {
    this.updateTheme();
    if (await this.loadMap()) {
      this.loadLines();
      this.loadClusters();
    }
  }
  // fetch lines of tram and draw them on map
  async loadLines() {
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
    });
  }

  // fetch clusters and draw them on map
  async loadClusters() {
    // get all line description to get a list of line with their clusters
    (
      await this.api.getLineListDescription(
        (
          await this.api.getTramLineList()
        ).map((line) => {
          return line.id;
        })
      )
    ).features.forEach(async (line) => {
      (
        await this.api.getClusterList(line.properties.ZONES_ARRET)
      ).features.forEach((cluster) => {
        // push the cluster to the list of clusters only if not already in it
        let exist = false;
        this.overlays.clusters.forEach((temp) => {
          if (cluster.properties.name == temp.options.title) {
            exist = true;
          }
        });
        if (exist) return;
        this.overlays.clusters.push(
          Leaflet.circleMarker(
            [cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]],
            {
              radius: 13,
              color: '#000',
              fillColor: '#fff',
              fillOpacity: 1,
              title: cluster.properties.name,
            }
          ).on('click', () => {
            // center view on cluster
            this.map.setView(
              [
                cluster.geometry.coordinates[1],
                cluster.geometry.coordinates[0],
              ],
              15
            );
            this.displayModal(
              cluster.properties.name,
              cluster.properties.code,
              cluster.geometry.coordinates[0],
              cluster.geometry.coordinates[1]
            );
          })
        );
      });
    });
  }

  /**
   * Display stops on the map or hide them if not visible in bounds
   * but will display if searchbar is not empty
   */
  handleDisplayClusters(force: boolean = false) {
    for (let cluster of this.overlays.clusters) {
      if (
        this.map.getBounds().contains(cluster.getLatLng()) &&
        (this.map.getZoom() >= 14 || force)
      ) {
        this.map.addLayer(cluster);
      } else {
        this.map.removeLayer(cluster);
      }
    }
  }

  /**
   * set the map view to the current position update it every second
   */
  locate() {
    if (
      this.overlays.position === undefined &&
      this.overlays.accuracy === undefined &&
      !this.locationEnabled
    ) {
      this.locationEnabled = true;
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
    let clusters = [];
    this.overlays.clusters.forEach((cluster) => {
      // set opacity to 0 if the cluster title does not match the searchbar
      let opacity = cluster.options.title
        .toLowerCase()
        .includes(value.toLowerCase())
        ? 1
        : 0.05;
      cluster.setStyle({ fillOpacity: opacity, opacity: opacity });
      if (opacity === 1) {
        clusters.push(cluster);
      }
    });
    if (clusters.length === 1) {
      this.map.setView(clusters[0].getLatLng());
    }
    this.handleDisplayClusters(value.length !== 0);
  }

  async displayModal(
    title: string,
    stopId: string,
    latitude: number,
    longitude: number
  ) {
    const modal = await this.modalController.create({
      component: StopComponent,
      componentProps: {
        title: title,
        stopId: stopId,
        latitude: latitude,
        longitude: longitude,
      },
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }
}
