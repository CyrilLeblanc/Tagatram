import { RouterModule, Routes } from '@angular/router';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss'],
})
export class StopComponent implements OnInit {
  title: string;
  stopId: string;
  latitude: number;
  longitude: number;
  routeButtons = false;
  goToButton = false;
  schedules;

  constructor(
    private api: ApiMetromobiliteService,
    private modalController: ModalController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.schedules = (await this.api.getClusterSchedule(this.stopId)).filter(
      (item) => {
        // filter to get only tram schedule
        let id = item.pattern.id.split(':');
        return id[0] === 'SEM' && id[1].length === 1;
      }
    );
  }

  renderTime(value: number): string {
    let date = new Date(
      new Date(value * 1000).getTime() - new Date().getTime()
    );
    if (new Date(value * 1000).getTime() > Date.now()) {
      date = new Date(0);
    }
    let hours = date.getHours() - 1;
    let minutes = date.getMinutes() + 1;
    let seconds = date.getSeconds();
    return minutes + 'mn ';
  }

  setFromPoint() {
    this.modalController.dismiss({
      status: 'from',
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }
  setToPoint() {
    this.modalController.dismiss({
      status: 'to',
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }

  goToMap() {
    this.router.navigate([
      '/tabs/map',
      {
        latitude: this.latitude,
        longitude: this.longitude,
      },
    ], {
      replaceUrl: true,
    });
  }
}
