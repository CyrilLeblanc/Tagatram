import { Stops } from './../interfaces/stops';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Line } from './../interfaces/line';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';
import { StopComponent } from '../stop/stop.component';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.page.html',
  styleUrls: ['./lines.page.scss'],
})
export class LinesPage implements OnInit {
  lineList: Line[];
  lineListDetailCondition = [];
  stopList = {};
  stopListNames;

  constructor(private api: ApiMetromobiliteService, private modalController: ModalController) {}

  ngOnInit() {
    this.initialisation();
  }

  async initialisation() {
    this.lineList = await this.api.getTramLineList();

    this.lineList.forEach(async (line) => {
      this.lineListDetailCondition[line.id] = false;
      this.api.getLineSchedule(line.id).then(async (stops) => {
        stops[0].arrets.forEach((name) => {
          name.stopName = name.stopName.replace(
            name.stopName.split(' ')[0],
            ''
          );
        });
        this.stopList[line.id] = stops[0].arrets;
      });
    });
  }

  detail(arg) {
    this.lineListDetailCondition[arg] = !this.lineListDetailCondition[arg];
  }

  direction(arg) {
    this.stopList[arg].reverse();
  }

  displayStop(stop) {
    this.modalController.create(
      {
        component: StopComponent,
        componentProps: {
          stopId: stop.parentStation.code,
          title: stop.stopName,
          goToButton: true,
          latitude: stop.lat,
          longitude: stop.lon,
        },
        breakpoints: [0, 0.3, 0.5, 0.8],
        initialBreakpoint: 0.5,
      }
    ).then(modal => {
      modal.present();
    })
  }
}
