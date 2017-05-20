/**
 * Created by Nicu on 4/30/17.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import {post} from "selenium-webdriver/http";

@Injectable()
export class RouteService {

    // ref.on("child_added", function(child) {
    //     console.log("readRoute" , child.key+': '+ child.val().destination);
    //     return {
    //     destination: child.val().destination,
    //         origin: child.val().origin,
    //         uid: child.val().uid
    //     }
    // });
readRoutes(){
    let items = [];
    let ref =  firebase.database()
        .ref('routes')
        .on("value", (snapshot) => {

            snapshot.forEach((child) => {
                items.push({
                    destination: child.val().destination,
                            origin: child.val().origin,
                            uid: child.val().uid
                });
                return false;
            });
        });
    return items;
}

    saveRoute(origin:any, destination:any) {
        // A post entry.
        let routes = firebase.database().ref().child('routes');
        let uid = firebase.auth().currentUser.uid;

        return routes.push().set({
            uid: uid,
            origin: origin,
            destination:destination
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
