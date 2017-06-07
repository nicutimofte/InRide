import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MapComponent } from './map/map.component';
import { DirectionsMapDirective } from './directions-map.directive';
import {AngularFireModule} from "angularfire2";
import {AF} from "./providers/af";
import { LoginPageComponent } from './login-page/login-page.component';
import {UserService} from "./services/user.service";
import {AngularFireDatabaseModule} from "angularfire2/database/database.module";
import {AngularFireAuthModule} from "angularfire2/auth/auth.module";
import {RouteService} from "./services/route.service";
import { FindRideComponent } from './find-ride/find-ride.component';
import {FindRouteComponent} from "./find-route/find-route.component";
import { ProfileComponent } from './profile/profile.component';
import {UserRoutesService} from "./services/userRoutes.service"

const firebaseConfig = {
  apiKey: your-apiKey,
  authDomain: your-authDomain,
  databaseURL: your-databaseUrl,
  projectId: your-projectId,
  storageBucket: your-storageBucket,
  messagingSenderId: your-messagingSenderId
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MapComponent,
    DirectionsMapDirective,
    LoginPageComponent,
    FindRideComponent,
    FindRouteComponent,
    ProfileComponent,

  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: your-api-key,
      libraries: ["places"]
    }),
     [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
],
  ],
  providers: [
    AF,
    UserService,
    RouteService,
    UserRoutesService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
