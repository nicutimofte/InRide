import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service'
import {RouteService} from '../services/route.service'
import {UserRoutesService} from '../services/userRoutes.service'
import {AF} from "../providers/af";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	private current: any;
  public attendingRoutes = [];  
  private tempRoute: any;

  constructor(private userService: UserService,private userRoutesService: UserRoutesService, private routeService: RouteService,
   public afService: AF) { }

  ngOnInit() {
  	this.afService.af.auth.onAuthStateChanged((user)=>{
      console.log("as",user);
      //this.current = user
    });
  	this.userService.readUser().then(user=>{
  	    console.log("USER:",user);
  	    this.current=user;
        //getting attenting routes
        let uRoutes = this.userRoutesService.readRoutesForUser(user.uid)
        console.log("foo ",uRoutes.length)
        for (var i = 0; i< uRoutes.length; i++)
        {
          this.tempRoute = uRoutes[i].route
          this.userService.getUser(uRoutes[i].owner).then(user => {console.log("attending", uRoutes[i])
            let route:any;
            console.log("PROBLEM",uRoutes[i])
            this.routeService.getRouteWithKey(this.tempRoute).then(resolve => {route = resolve;
              this.attendingRoutes.push({'oUserName' : user.userName, 'oPhone' : user.phone, 'attending' : route})
              console.log("tempAtt",this.attendingRoutes)
            })
          
            })
        }
    });
  	// console.log(this.userService.readUser())
  }

}
