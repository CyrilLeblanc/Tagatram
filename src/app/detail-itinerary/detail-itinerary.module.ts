import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailItineraryPageRoutingModule } from './detail-itinerary-routing.module';

import { DetailItineraryPage } from './detail-itinerary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailItineraryPageRoutingModule
  ],
  declarations: [DetailItineraryPage]
})
export class DetailItineraryPageModule {}
