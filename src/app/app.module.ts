import { Storage } from '@ionic/storage';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

import { ChoiceStopPageModule } from './choice-stop/choice-stop.module';
import { StopFilterPipe } from './pipes/stop-filter.pipe';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ChoiceStopPageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Storage, Geolocation],
  bootstrap: [AppComponent],
})
export class AppModule {}
