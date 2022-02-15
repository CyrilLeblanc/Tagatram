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
        console.debug('API: lineList loaded from cache', await cache);
        resolve(cache);
      } else {
        this.http
          .get(this.baseUrl + 'routers/default/index/routes')
          .subscribe(async (data: Line[]) => {
            console.debug('API: lineList loaded from API', await data);
            this.storage.set('cache_lineList', data);
            resolve(data);
          });
      }
    });
  }

  async getTramLineList() {
    return (await this.getLineList()).filter((line: Line) => {
      return line.mode === 'TRAM';
    });
  }

  async getLineDescription(id: string): Promise<LineDescription> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_lineDescription_' + id);
      if (cache) {
        console.debug(
          `API: lineDescription ${id} loaded from cache`,
          await cache
        );
        resolve(cache);
      } else {
        this.http
          .get(
            this.baseUrl +
              `lines/json?types=ligne&codes=${id.replace(':', '_')}`
          )
          .subscribe(async (data: LineDescription) => {
            data.features[0].geometry.coordinates[0] = this.reverseCoords(
              data.features[0].geometry.coordinates[0]
            );
            console.debug(`API: lineDescription loaded from API`, await data);
            this.storage.set(`cache_lineDescription_${id}`, data);
            resolve(data);
          });
      }
    });
  }

  async getTramStopList(): Promise<Stops> {
    return new Promise(async (resolve) => {
      const cache = await this.storage.get('cache_tramStopList');
      if (cache) {
        console.debug('API: tramStopList loaded from cache', await cache);
        resolve(cache);
      } else {
        this.http
          .get(this.baseUrl + 'stops/json?types=arret&codes=T')
          .subscribe(async (data: Stops) => {
            console.debug('API: tramStopList loaded from API', await data);
            this.storage.set('cache_tramStopList', data);
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
        console.debug(
          `API: lineSchedule ${lineId} loaded from cache`,
          await cache
        );
        resolve(cache);
      } else {
        this.http
          .get(
            this.baseUrl +
              `ficheHoraires/json?route=${lineId}`
          )
          .subscribe(async (data: LineSchedule) => {
            console.debug(`API: lineSchedule loaded from API`, data);
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
}
