import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DataService } from './services/data.service';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { MapComponent } from './map/map.component';
import { MapTestComponent } from './map-test/map-test.component';
import { DirectionsMapDirective } from './map/directions-map.directive';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MapComponent,
    MapTestComponent,
    DirectionsMapDirective
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA5E4pMg2NLB5dtfGMcsJHpLwYLU5hnfOk',
      libraries: ["places"]
    })
  ],
  providers: [
    DataService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
