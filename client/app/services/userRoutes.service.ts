/**
 * Created by Nicu on 4/30/17.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import {post} from "selenium-webdriver/http";
import {UserService} from "./user.service";

@Injectable()
export class UserRoutesService {

    // ref.on("child_added", function(child) {
    //     console.log("readRoute" , child.key+': '+ child.val().destination);
    //     return {
    //     destination: child.val().destination,
    //         origin: child.val().origin,
    //         uid: child.val().uid
    //     }
    // });
    constructor(private userService: UserService){

    }
readRoutes(){
    let items = [];
    let ref =  firebase.database()
        .ref('routes')
        .on("value", (snapshot) => {
            snapshot.forEach((child) => {
                let user = this.userService.getUser(child.val().uid).then(user=>{
                    //console.log("RUSER:",user);
                    items.push({
                        user:user,
                        destination: child.val().destination,
                        origin: child.val().origin,
                        uid: child.val().uid
                    });
                })
                return false;
            });
        });
    return items;
}

    saveRoute(routeId:any,userId:any) {
        // A post entry.
        let userRoutes = firebase.database().ref().child('userRoutes');
        /*let uid = firebase.auth().currentUser.uid;*/

        return userRoutes.push().set({
            userId: userId,
            routeId: routeId
        });
        //
        // // Get a key for a new User.
        // var newUserKey = firebase.database().ref().child('users').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        // var updates = {};
        // updates['/routes/' + uid] = postData;
        //
        // return firebase.database().ref().update(updates);
    }

}
