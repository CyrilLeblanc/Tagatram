import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailItineraryPage } from './detail-itinerary.page';

const routes: Routes = [
  {
    path: '',
    component: DetailItineraryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailItineraryPageRoutingModule {}
