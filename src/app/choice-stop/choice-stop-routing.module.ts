import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoiceStopPage } from './choice-stop.page';

const routes: Routes = [
  {
    path: '',
    component: ChoiceStopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoiceStopPageRoutingModule {}
