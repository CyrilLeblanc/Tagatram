import { Component, OnInit } from '@angular/core';
import { Line } from './../interfaces/line';
import { Stops } from './../interfaces/stops';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';

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

  constructor(
    private api: ApiMetromobiliteService
  ) { }

  ngOnInit() {
    this.initialisation();
  }

  async initialisation() {
    this.lineList = await this.api.getTramLineList();
    console.log(this.lineList);

    this.lineList.forEach(async line => {
      this.lineListDetailCondition[line.id] = false;
      this.api.getLineSchedule(line.id).then(async stops => {
        stops[0].arrets.forEach(name => {
          name.stopName = name.stopName.replace(name.stopName.split(' ')[0], '');
        });
        this.stopList[line.id] = stops[0].arrets;
      });
    });
    console.log(this.stopList);
  }
  
  detail(arg) {
    this.lineListDetailCondition[arg] = !this.lineListDetailCondition[arg];
  }

  direction(arg) {
    this.stopList[arg].reverse();
  }
  
}
