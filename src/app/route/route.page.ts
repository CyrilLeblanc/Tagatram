import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, ModalController } from '@ionic/angular';
import { ChoiceStopPage } from '../choice-stop/choice-stop.page';
import { ApiMetromobiliteService } from '../services/api-metromobilite.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {
  @ViewChild(IonDatetime, {static: true }) datetime: IonDatetime;

  favoriteTrip: boolean = false;
  PMRaccess: boolean = false;
  listStops = {};
  listLine;
  allStops = [];
  selectedStop;
  depart: string = 'Départ';
  arrivee: string = 'Arrivée';
  startStop;
  endStop;
  favoriteListTrip = [];
  hourSelected: number;
  daySelected: number;
  dateString: String = 'Date';
  timeString: String = 'Heure';
  timeFormat: string;
  dateFormat: string;
  coorDeparture: [number, number];
  coorArrival: [number, number];
  chaipas;

  constructor(
    private api: ApiMetromobiliteService,
    public modalCtrl: ModalController,
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

  reverseStops() {
    let temp = this.startStop;
    this.startStop = this.endStop;
    this.endStop = temp;
    this.arrivee = this.getStopNameFromStopId(this.endStop);
    this.depart = this.getStopNameFromStopId(this.startStop);
  }

  async openModalDeparture() {
    const modal = await this.modalCtrl.create({
      component: ChoiceStopPage,componentProps: {  
        'from': "departure"     
      }   
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    this.startStop = data.selectedStop;
    this.depart = this.getStopNameFromStopId(data.selectedStop);
    this.coorDeparture = this.getStopCoorFromStopId(data.selectedStop);
   }

  async openModalArrival() {
    const modal = await this.modalCtrl.create({
      component: ChoiceStopPage,componentProps: {  
        'from': "arrival"     
      }   
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    this.endStop = data.selectedStop;
    this.arrivee = this.getStopNameFromStopId(data.selectedStop);
    this.coorArrival = this.getStopCoorFromStopId(data.selectedStop);
  }

  segmentChanged() {
    if (this.favoriteTrip) {
      this.favoriteTrip = false;
    }
    else { this.favoriteTrip = true; }
  }

  getStopNameFromStopId(id) {
    let name: string;
    this.allStops.forEach(stop => {
      if (id == stop.stopId) {
        name = stop.stopName;
      }
    });
    return name;
  }

  getStopCoorFromStopId(id) {
    let coor: [number, number];
    this.allStops.forEach(stop => {
      if (id == stop.stopId) {
        coor = [stop.parentStation.lat, stop.parentStation.lon];
      }
    });
    console.log(coor);
    return coor;
  }

  createFavorite() {
    console.log(this.startStop);
    console.log(this.endStop);
    if (this.startStop && this.endStop) {
      this.favoriteListTrip.push([this.getStopNameFromStopId(this.startStop), this.getStopNameFromStopId(this.endStop)]);
      console.log('new favorite');
    }
    console.log(this.favoriteListTrip);
  }

  formatTime(arg) {
    let time = Date.parse(arg);
    this.hourSelected = time % 86400000;
    let timeDate = new Date(this.hourSelected);
    this.timeString = timeDate.getHours() + ' : ' + timeDate.getMinutes();
    this.timeFormat = timeDate.getHours() + ':' + timeDate.getMinutes();
    console.log(this.timeFormat);
  }

  formatDate(arg) {
    let date = Date.parse(arg);
    this.daySelected = new Date(date).setHours(0, 0, 0, 0);
    let dayDate = new Date(this.daySelected)
    let mois = dayDate.getMonth() + 1;
    this.dateString = dayDate.getDate() +'/'+ mois +'/'+ dayDate.getFullYear();
    this.dateFormat = dayDate.getFullYear() + '-' + mois + '-' + dayDate.getDate();
    console.log(this.dateFormat);
  }

  async itinerary() {
    this.chaipas = await this.api.getRoute(
      this.coorDeparture,
      this.coorArrival,
      this.dateFormat,
      this.timeFormat,
      ['TRAM', 'WALK'],
      this.PMRaccess
    ) 
    console.log(this.chaipas);
  }



}
