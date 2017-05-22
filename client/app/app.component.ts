import {Component, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {AF} from "./providers/af";
import {Router} from "@angular/router";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  private LOGO = require("./images/logo.png");

  public isLoggedIn: boolean;
  constructor(public afService: AF, private router: Router,private userService: UserService) {
    // This asynchronously checks if our user is logged in and will automatically
    // redirect them to the Login page when the status changes.

    this.afService.af.auth.onAuthStateChanged(
        (user) => {
          if(user == null) {
            console.log("Not Logged in.");
            this.router.navigate(['/login']);
            this.isLoggedIn = false;
          }
          else {
             this.userService.saveUser();
             this.userService.readUser();

            console.log("Successfully Logged in.");
            this.isLoggedIn = true;
            this.router.navigate(['/']);
            console.log(user);
          }
        }
    );
  }
  logout() {
    this.afService.logout();
  }
}
