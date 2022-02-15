import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiMetromobiliteService } from '../services/api-metromobilite.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {

  favoriteTrip: boolean = false;
  PMRaccess: boolean = false;
  departure: String = '';
  arrival: String = '';
  listStops = {};
  listLine;
  allStops = [];

  constructor(
    private api: ApiMetromobiliteService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.initialisation();
  }

  async initialisation() {
    this.listLine = await this.api.getTramLineList();
    console.log(this.listLine);

    this.listLine.forEach(async line => {
      await this.api.getLineSchedule(line.id).then(async stop => {
        this.listStops[line.id] = stop["0"].arrets;
        stop[0].arrets.forEach(data => {
          this.allStops.push(data);
          console.log(data);
        });
      });
      console.log(this.listStops);
      console.log(this.listStops[line.id]);
      console.log(this.allStops);

    });
    console.log(this.listStops);

    
  }

  segmentChanged() {
    if (this.favoriteTrip) {
      this.favoriteTrip = false;
    }
    else { this.favoriteTrip = true; }
  }

  start() {
    console.log(this.departure);
  }



}
