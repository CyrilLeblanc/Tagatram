import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoiceStopPageRoutingModule } from './choice-stop-routing.module';

import { ChoiceStopPage } from './choice-stop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoiceStopPageRoutingModule
  ],
  declarations: [ChoiceStopPage]
})
export class ChoiceStopPageModule {}
