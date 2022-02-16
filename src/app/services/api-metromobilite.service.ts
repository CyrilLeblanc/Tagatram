import { Clusters } from './../interfaces/clusters';
import { PoleSchedule } from './../interfaces/pole-schedule';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { LineDescription } from './../interfaces/line-description';
import { Line } from '../interfaces/line';
import { Stops } from '../interfaces/stops';
import { LineSchedule } from './../interfaces/line-schedule';
@Injectable({
  providedIn: 'root',
})
export class ApiMetromobiliteService {
  private baseUrl: string = 'https://data.mobilites-m.fr/api/';

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  async getLineList(): Promise<Line[]> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_lineList');
      if (cache) {
        resolve(cache);
      } else {
        this.http
          .get(this.baseUrl + 'routers/default/index/routes')
          .subscribe(async (data: Line[]) => {
            this.storage.set('cache_lineList', data);
            resolve(data);
          });
      }
    });
  }

  async getTramLineList(): Promise<Line[]> {
    return (await this.getLineList()).filter((line: Line) => {
      return line.mode === 'TRAM';
    });
  }

  async getLineDescription(id: string): Promise<LineDescription> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_lineDescription_' + id);
      if (cache) {
        resolve(cache);
      } else {
        this.http
          .get(
            this.baseUrl +
              `lines/json?types=ligne&codes=${id.replace(':', '_')}`
          )
          .subscribe(async (data: LineDescription) => {
            data.features[0].geometry.coordinates[0] = this.reverseCoords(
              data.features[0].geometry.coordinates[0] as any
            );
            this.storage.set(`cache_lineDescription_${id}`, data);
            resolve(data);
          });
      }
    });
  }

  async getLineListDescription(id: string[]): Promise<LineDescription> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get(
        'cache_lineListDescription_' + id.join(',')
      );
      if (cache) {
        resolve(cache);
      } else {
        this.http
          .get(
            this.baseUrl +
              `lines/json?types=ligne&codes=${id
                .map((id) => id.replace(':', '_'))
                .join(',')}`
          )
          .subscribe(async (data: LineDescription) => {
            data.features.forEach((feature) => {
              // reverse coords
              feature.geometry.coordinates[0] = this.reverseCoords(
                feature.geometry.coordinates[0] as any
              );
            });
            this.storage.set(`cache_lineListDescription_${id.join(',')}`, data);
            resolve(data);
          });
      }
    });
  }

  async getStopList(): Promise<Stops> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_tramStopList');
      if (cache) {
        resolve(cache);
      } else {
        this.http
          .get(this.baseUrl + 'bbox/json?types=arret')
          .subscribe(async (data: Stops) => {
            this.storage.set('cache_tramStopList', data);
            resolve(data);
          });
      }
    });
  }

  async getClusterList(id: string[]): Promise<Clusters> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_clusterList_' + id.join(','));
      if (cache) {
        resolve(cache);
      } else {
        this.http
          .get(
            this.baseUrl +
              `points/json?types=clusters&codes=${id
                .map((id) => id.replace('_', ':'))
                .join(',')}`
          )
          .subscribe(async (data: Clusters) => {
            data.features.forEach((feature) => {
              // reverse coords
              feature.geometry.coordinates = this.reverseCoord(
                feature.geometry.coordinates as any
              ) as any;
            });
            this.storage.set(`cache_clusterList_${id.join(',')}`, data);
            resolve(data);
          });
      }
    });
  }

  /**
   * @description alias of getLineSchedule()
   * @deprecated use getLineSchedule() instead
   */
  async getStopByLine(lineId: string): Promise<LineSchedule> {
    return this.getLineSchedule(lineId);
  }

  async getLineSchedule(lineId: string): Promise<LineSchedule> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_lineSchedule_' + lineId);
      if (cache) {
        /* console.debug(
          `API: lineSchedule ${lineId} loaded from cache`,
          await cache
        ); */
        resolve(cache);
      } else {
        this.http
          .get(this.baseUrl + `ficheHoraires/json?route=${lineId}`)
          .subscribe(async (data: LineSchedule) => {
            this.storage.set(`cache_lineSchedule_${lineId}`, data);
            resolve(data);
          });
      }
    });
  }

  /**
   * reverse a coordinate
   * @param item
   * @returns
   */
  reverseCoord(item: [number, number]) {
    let temp = item[0];
    item[0] = item[1];
    item[1] = temp;
    return item;
  }

  /**
   * reverse a list of coordinate
   * @param items
   */
  reverseCoords(items: [number, number][]) {
    items.forEach((item, index) => {
      items[index] = this.reverseCoord(items[index]);
    });
    return items;
  }

  /**
   * get route beetween 2 points
   * @param from
   * @param to
   * @param date
   * @param time
   * @param mode
   * @param pmr
   * @returns
   */
  async getRoute(
    from: [number, number],
    to: [number, number],
    date: string,
    time: string,
    mode: string,
    pmr: boolean
  ) {
    return new Promise(async (resolve) => {
      this.http
        .get(
          this.baseUrl +
            `routes/json?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}&date=${date}&time=${time}&mode=${mode}&pmr=${pmr}`
        )
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  async getPoleSchedule(stopId: string): Promise<PoleSchedule[]> {
    return new Promise(async (resolve) => {
      this.http
        .get(this.baseUrl + `routers/default/index/stops/${stopId}/stoptimes`)
        .subscribe(async (data: PoleSchedule[]) => {
          resolve(data);
        });
    });
  }

  async getClusterSchedule(clusterId: string): Promise<any>{
    return new Promise(async (resolve) => {
      this.http
        .get(this.baseUrl + `routers/default/index/clusters/${clusterId.replace('_', ':')}/stoptimes`)
        .subscribe(async (data: any) => {
          resolve(data);
        });
    });
  }
}
