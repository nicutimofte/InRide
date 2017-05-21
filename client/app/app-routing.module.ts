import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import {LoginPageComponent} from "./login-page/login-page.component";
import {FindRideComponent} from "./find-ride/find-ride.component";
import {MapComponent} from "./map/map.component";
import {FindRouteComponent} from "./find-route/find-route.component";
import {ProfileComponent} from "./profile/profile.component"

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'route/find', component: FindRouteComponent },
  { path: 'route/post', component: MapComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'profile', component: ProfileComponent}
  // { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
