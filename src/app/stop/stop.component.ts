import { ApiMetromobiliteService } from './../services/api-metromobilite.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss'],
})
export class StopComponent implements OnInit {
  title: string;
  stopId: string;
  schedules;

  constructor(private api: ApiMetromobiliteService) {}

  async ngOnInit() {
    this.schedules = (await this.api.getClusterSchedule(this.stopId))
      .filter((item) => {
        // filter to get only tram schedule
        let id = item.pattern.id.split(':');
        return id[0] === 'SEM' && id[1].length === 1;
      })
  }

  renderTime(value: number): string {
    let date = new Date(
      new Date(value * 1000).getTime() - new Date().getTime()
    );
    if (new Date(value * 1000).getTime() > Date.now()) {
      date = new Date(0);
    }
    let hours = date.getHours()-1;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return minutes + 'mn ';
  }
}
