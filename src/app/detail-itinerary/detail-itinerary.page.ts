import { Component, OnInit } from '@angular/core';
import { ModalController, NumericValueAccessor } from '@ionic/angular';

@Component({
  selector: 'app-detail-itinerary',
  templateUrl: './detail-itinerary.page.html',
  styleUrls: ['./detail-itinerary.page.scss'],
})
export class DetailItineraryPage implements OnInit {
  route;
  legs = [];
  chosenItinerary: number;
  durationTotal: number;
  itinerary: string[] = [];

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    this.initialisation();
  }

  initialisation() {
    let taille = this.route.plan.itineraries.length;
    this.chosenItinerary = taille - 1;
    let selected = this.route.plan.itineraries[this.chosenItinerary];
    for (let i = taille - 2; i >= 0; i--) {
      if (selected.duration >= this.route.plan.itineraries[i].duration) {
        selected = this.route.plan.itineraries[i];
        this.chosenItinerary = i;
      }
    }
    this.legs = this.route.plan.itineraries[this.chosenItinerary].legs;
    this.getEachSteps();
  }

  getEachSteps() {
    this.legs.forEach((leg) => {
      let time = new Date(leg.startTime);
      let formatedTime = time.getHours() + 'h' + time.getMinutes();
      this.itinerary.push(`${formatedTime}`)
      if (leg.mode == 'TRAM') {
        let durationMinute = Math.trunc(leg.duration / 60);
        let explain = `Prendre le tram ${leg.routeShortName} direction ${leg.headsign} de l'arrêt ${leg.from.name} jusqu'à l'arrêt ${leg.to.name}.
           Durée en tram ${durationMinute} minutes.`;
        this.itinerary.push(explain);
      } else {
        let durationMinute = Math.trunc(leg.duration / 60);
        leg.steps.forEach((step) => {
          let direction;
          let distance = Math.trunc(step.distance * 10) / 10;
          switch (step.absoluteDirection) {
            case 'NORTH':
              direction = 'du nord';
              break;
            case 'SOUTH':
              direction = 'du sud';
              break;
            case 'EAST':
              direction = `de l'est`;
              break;
            default:
              direction = `de l'ouest`;
              break;
          }
          if (step.streetName) {
            let explain = `Marchez ${distance}m pendant ${durationMinute} minutes en direction ${direction} sur ${step.streetName}.`;
            this.itinerary.push(explain);
          } else {
            let explain = `Marchez ${distance}m pendant ${durationMinute} minutes en direction ${direction}.`;
            this.itinerary.push(explain);
          }
        });
      }
    });
    // heure d'arrivée prévue
    let arriveeTime = new Date(this.legs[this.legs.length - 1].endTime);
    this.itinerary.push(`Arrivée prévue à ${arriveeTime.getHours() + 'h' + arriveeTime.getMinutes()}`);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
