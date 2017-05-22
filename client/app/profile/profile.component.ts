import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service'
import {AF} from "../providers/af";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	private current: any;

  constructor(private userService: UserService, public afService: AF) { }

  ngOnInit() {
  	this.afService.af.auth.onAuthStateChanged((user)=>{
      console.log("as",user);
      //this.current = user
    });
  	this.userService.readUser().then(user=>{
  	    console.log("USER:",user);
  	    this.current=user;
    });
  	console.log(this.userService.readUser())
  }

}
