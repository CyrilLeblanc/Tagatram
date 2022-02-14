import { Component, OnInit } from '@angular/core';
import { Line } from './../interfaces/line';
import { ApiMetromobiliteService } from './../services/api-metromobilite.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.page.html',
  styleUrls: ['./lines.page.scss'],
})
export class LinesPage implements OnInit {

  lineList: Line[];
  lineListDetailCondition = [];

  constructor(
    private api: ApiMetromobiliteService
  ) { }

  ngOnInit() {
    this.initialisation();

  }

  async initialisation() {
    this.lineList = await this.api.getTramLineList();
    console.log(this.lineList);

    this.lineList.forEach(line => {
      this.lineListDetailCondition[line.id] = false;
    });

    console.log(this.lineListDetailCondition);
  }

  detail(arg) {
    this.lineListDetailCondition[arg] = !this.lineListDetailCondition[arg];
    console.log(this.lineListDetailCondition);
  }
  

}
