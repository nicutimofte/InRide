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

    readRoutes(){
        var userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/routes/' + userId).once('value').then(function(snapshot) {
            return {
                uid: snapshot.val().uid,
                origin: snapshot.val().origin,
                destination: snapshot.val().destination
            }
        });
    }



    saveRoute(origin:any, destination:any) {
        // A post entry.
        let uid = firebase.auth().currentUser.uid;

        var postData = {
            uid: uid,
            origin: origin,
            destination:destination
        };
        console.log("data:",postData);
        //
        // // Get a key for a new User.
        // var newUserKey = firebase.database().ref().child('users').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/routes/' + uid] = postData;

        return firebase.database().ref().update(updates);
    }
}
