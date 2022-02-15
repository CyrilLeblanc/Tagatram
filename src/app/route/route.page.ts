import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChoiceStopPage } from '../choice-stop/choice-stop.page';
import { ApiMetromobiliteService } from '../services/api-metromobilite.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {

  favoriteTrip: boolean = false;
  PMRaccess: boolean = false;
  listStops = {};
  listLine;
  allStops = [];
  selectedStop;

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

  reverseStops() {
    console.log(this.selectedStop);
  }

  async openModalDeparture() {
    const modal = await this.modalCtrl.create({
      component: ChoiceStopPage,componentProps: {  
        'from': "departure"     
      }   
    });
    return await modal.present();
   }

   async openModalArrival() {
    const modal = await this.modalCtrl.create({
      component: ChoiceStopPage,componentProps: {  
        'from': "arrival"     
      }   
    });
    return await modal.present();
   }

  segmentChanged() {
    if (this.favoriteTrip) {
      this.favoriteTrip = false;
    }
    else { this.favoriteTrip = true; }
  }




}
