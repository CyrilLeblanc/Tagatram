import { Router, ActivatedRoute } from '@angular/router';
import { Route } from './../interfaces/route';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ThemeChangerService } from './../services/theme-changer.service';
import { Line } from './../interfaces/line';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';
import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { OnDestroy } from '@angular/core';
import { StopComponent } from '../stop/stop.component';
import * as Leaflet from 'leaflet';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnDestroy {
  locationEnabled = false;
  map: Leaflet.Map;
  searchbar: string = '';
  overlays: { [key: string]: Leaflet.layerGroup } = {
    clusters: [],
    route: [],
  };
  layer: { [key: string]: Leaflet.tileLayer } = {};
  fromPoint: [number, number];
  toPoint: [number, number];

  constructor(
    private api: ApiMetromobiliteService,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private themeChanger: ThemeChangerService,
    private alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  async loadMap() {
    console.log(this);
    if (this.map === undefined) {
      this.map = Leaflet.map('map').setView([45.1709, 5.7395], 12);
      this.map.zoomControl.remove();

      this.layer.tagMap.addTo(this.map);

      this.map.on('moveend', async () => {
        this.handleDisplayClusters();
      });

      return true;
    }
  }

  updateTheme() {
    if (this.map) this.map.removeLayer(this.layer.tagMap);
    this.layer.tagMap = Leaflet.tileLayer(
      `https://data.mobilites-m.fr/carte${
        this.themeChanger.getTheme() === 'dark' ? '-dark' : ''
      }/{z}/{x}/{y}.png`
    );
    if (this.map) this.map.addLayer(this.layer.tagMap);
  }

  async ionViewDidEnter() {
    this.updateTheme();
    if (await this.loadMap()) {
      this.loadLines();
      this.loadClusters();
      this.activatedRoute.params.subscribe((params) => {
        if (params.latitude && params.longitude && this.map) {
          this.map.setView([params.latitude, params.longitude], 15);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.map.remove();
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
      ]).addTo(this.map);
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
            [cluster.geometry.coordinates[0], cluster.geometry.coordinates[1]],
            {
              radius: 13,
              color: '#000',
              fillColor: '#fff',
              fillOpacity: 1,
              title: cluster.properties.name,
            }
          ).on('click', () => {
            // center view on cluster
            this.map.setView(cluster.geometry.coordinates, 15);
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
        : 0.1;
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
        routeButtons: true,
      },
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });
    modal.onDidDismiss().then((modalData) => {
      if (modalData.data) {
        this[`${modalData.data.status}Point`] = [
          modalData.data.latitude,
          modalData.data.longitude,
        ];
        if (this.fromPoint && this.toPoint) {
          this.api.getRoute(this.fromPoint, this.toPoint).then((data) => {
            this.displayRoute(data);
          });
        }
      }
    });
    await modal.present();
  }

  updateRouteInfo(status: 'from' | 'to', coord: [number, number]) {
    this[`${status}Point`] = coord;
    if (this.fromPoint && this.toPoint) {
      this.api.getRoute(this.fromPoint, this.toPoint).then((data) => {
        this.displayRoute(data);
      });
    }
  }

  removeRouteOverlay() {
    this.overlays.route.forEach((layer) => {
      this.map.removeLayer(layer);
    });
  }

  displayRoute(route: Route) {
    console.log(route);
    this.removeRouteOverlay();
    if (route.error) {
      console.error('ROUTER', route.error.msg);
      this.alertController
        .create({
          header: route.error.message,
          message: route.error.msg,
        })
        .then((modal) => {
          modal.present();
        });
      return !route.error.noPath;
    }
    this.overlays.routes = [];
    let firstCoord: [number, number], lastCoord: [number, number];
    route.plan.itineraries[0].legs.forEach((leg, index) => {
      let key = leg.mode === 'WALK' ? 'steps' : 'intermediateStops';
      //firstCoord = [leg[key][leg[key].length - 1].lat, leg[key][leg[key].length - 1].lon];
      //lastCoord = [leg[key][0].lat, leg[key][0].lon];

      let coordList = leg[key].map((item, index) => {
        return [item.lat, item.lon];
      });

      if (index !== 0 && lastCoord !== undefined) {
        coordList.unshift(lastCoord);
      }

      this.overlays.route.push(
        Leaflet.polyline(coordList, {
          color: `#${key === 'steps' ? 'b22d24' : leg.routeColor}`,
          weight: 12,
        })
          .addTo(this.map)
          .bringToBack()
      );
      lastCoord = coordList[coordList.length - 1];
    });
  }
}
