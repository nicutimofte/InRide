import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service'
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

  constructor(private userService: UserService,private userRoutesService: UserRoutesService,
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
        let uRoutes = this.userRoutesService.getUsersRoutes(user.uid)
        console.log("USER Routes:",uRoutes)
        this.attendingRoutes = uRoutes
    });
  	console.log(this.userService.readUser())
  }

}
