import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoiceStopPageRoutingModule } from './choice-stop-routing.module';

import { ChoiceStopPage } from './choice-stop.page';

import { StopFilterPipe } from '../pipes/stop-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoiceStopPageRoutingModule
  ],
  exports: [StopFilterPipe],
  declarations: [ChoiceStopPage, StopFilterPipe]
})
export class ChoiceStopPageModule {}
