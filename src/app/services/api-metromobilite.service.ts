import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { LineDescription } from './../interfaces/line-description';
import { Line } from '../interfaces/line';

@Injectable({
  providedIn: 'root',
})
export class ApiMetromobiliteService {
  private baseUrl: string = 'http://data.mobilites-m.fr/api/';
  private cache: { [key: string]: any } = {
    lineList: null,
  };

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create();
    this.storage.get('cache').then((data) => {
      if (data !== null) this.cache = data;
    });
  }

  /**
   * TODO make callable in data tree
   * generic get function to fetch data
   *  - from cache if cachable and available or
   *  - from this instance if available or
   *  - from API
   * @param key name of value. If in arborescence separate var name by ':' example : 'lineDescription:SEM_C'
   * @param relativeUrlPath
   * @param callback treatement to data (must return data)
   * @returns Promise
   */
  private get(key: string, relativeUrlPath: string, callback?: Function): Promise<any> {
    let cachable: boolean = this.cache[key] !== undefined;

    return new Promise(async (resolve) => {
      if (cachable && this.cache[key] !== null) {
        // if cachable and available in cache
        console.info(`API: ${key} loaded from cache`, this.cache[key]);
        resolve(this.cache[key]);
        return;
      }
      if (!cachable || this.cache[key] === null) {
        // if cachable or unavailable in cache
        this.http
          .get(this.baseUrl + relativeUrlPath)
          .subscribe(async (data) => {
            if (callback) data = callback(data);
            if (cachable) {
              this.cache[key] = data;
              await this.storage.set('cache', this.cache);
            } else {
              this[key] = data;
            }
            console.info(`API: ${key} loaded from API`, this[key]);
            resolve(data);
            return;
          });
      }
    });
  }

  async getLineList(): Promise<Line[]> {
    return (await this.get(
      'lineList',
      'routers/default/index/routes'
    )) as Line[];
  }

  async getTramLineList(): Promise<Line[]> {
    let tramLineList: Line[] = [];
    (await this.getLineList()).forEach((line: Line) => {
      if (line.mode === 'TRAM') {
        tramLineList.push(line);
      }
    });
    return tramLineList;
  }

  async getLineDescription(id: string): Promise<LineDescription> {
    id = id.replace(':', '_');
    return (await this.get(
      `lineDescription:${id}`,
      'lines/json?types=ligne&codes=' + id,
      (data: LineDescription) => {
        // reverse coordinates values
        let coords = data.features[0].geometry.coordinates[0];
        coords.forEach((coord: [number, number], index) => {
          let temp = coord[0];
          coord[0] = coord[1];
          coord[1] = temp;
          data.features[0].geometry.coordinates[0][index] = coord;
        });
        return data;
      }
    )) as LineDescription;
  }
}
