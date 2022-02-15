import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {

  favoriteTrip: boolean = false;
  PMRaccess: boolean = false;

  constructor() { }

  ngOnInit() {
  }


  segmentChanged() {
    if (this.favoriteTrip) {
      this.favoriteTrip = false;
    }
    else { this.favoriteTrip = true; }
    console.log(this.favoriteTrip, this.PMRaccess);
  }


}
