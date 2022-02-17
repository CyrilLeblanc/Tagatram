import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiMetromobiliteService } from '../services/api-metromobilite.service';

@Component({
  selector: 'app-choice-stop',
  templateUrl: './choice-stop.page.html',
  styleUrls: ['./choice-stop.page.scss'],
})
export class ChoiceStopPage implements OnInit {
  listStops = {};
  listLine;
  allStops = [];
  searched: String = '';
  from: string;
  message: string = '';
  selectedStop;

  constructor(
    private api: ApiMetromobiliteService,
    public viewCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initialisation();
    this.displayMessage();
    this.selectedStop = null;
  }

  async initialisation() {
    this.listLine = await this.api.getTramLineList();

    this.listLine.forEach(async (line) => {
      await this.api.getLineSchedule(line.id).then(async (stop) => {
        this.listStops[line.id] = stop['0'].arrets;
        stop[0].arrets.forEach((data) => {
          this.allStops.push(data);
        });
      });
    });
  }

  searchBar() {}

  stopChoosen(data) {
    this.selectedStop = data;
    this.dismiss();
  }

  displayMessage() {
    if (this.from == 'departure') {
      this.message = 'Choisissez votre arrêt de départ';
    } else {
      this.message = 'Choisissez votre terminus';
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({
      from: this.from,
      selectedStop: this.selectedStop,
    });
  }
}
