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
import {AngularFireModule, AuthProviders, AuthMethods} from "angularfire2";
import {AF} from "./providers/af";
import { LoginPageComponent } from './login-page/login-page.component';
import {UserService} from "./services/user.service";

const firebaseConfig = {
  apiKey: "AIzaSyBszStTPolsR_W_fxPBKhph9Jds_oP9FKg",
  authDomain: "ridein-1492801980487.firebaseapp.com",
  databaseURL: "https://ridein-1492801980487.firebaseio.com",
  projectId: "ridein-1492801980487",
  storageBucket: "ridein-1492801980487.appspot.com",
  messagingSenderId: "470057804554"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MapComponent,
    MapTestComponent,
    DirectionsMapDirective,
    LoginPageComponent,

  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA5E4pMg2NLB5dtfGMcsJHpLwYLU5hnfOk',
      libraries: ["places"]
    }),
    AngularFireModule.initializeApp(firebaseConfig,{
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    })
  ],
  providers: [
    DataService,
    AF,
    UserService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
