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
import {RouteService} from "./route.service"

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
    constructor(private userService: UserService,
                private routeService: RouteService){

    }
    readUserRoutes(){
        let items = [];
        let ref =  firebase.database()
            .ref('userRoutes')
            .on("value", (snapshot) => {
                snapshot.forEach(child => {
                    items.push({
                        owner: child.val().owner,
                        route: child.val().routeId,
                        user: child.val().userId
                    })
                    return false;
                });
            });
        console.log("readUserRoutes items:",items)
        return items;
    }
    getUsersRoutes(userId:any){
        let items = []
        let urs = this.readUserRoutes()
        urs.forEach(ur=>{
            if(ur.user == userId){
                items.push(ur)
            }
            return false
        })
        console.log("getUserRoutes items:",items)
        return items
    }
    saveUserRoute(routeId:any,userId:any) {
        // A post entry.
        let userRoutes = firebase.database().ref().child('userRoutes');
        /*let uid = firebase.auth().currentUser.uid;*/
        let ownerId = this.routeService.getRouteOwner(routeId)
        return userRoutes.push().set({
            ownerId: ownerId,
            userId: userId,
            routeId: routeId
        });

    }

}
