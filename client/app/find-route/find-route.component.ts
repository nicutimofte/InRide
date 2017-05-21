import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {GoogleMapsAPIWrapper, MapsAPILoader} from "angular2-google-maps/core";
import {FormControl} from "@angular/forms";

import {} from '@types/googlemaps';
import {neighbours} from './mockData/neighbours.mock';
import {AF} from "../providers/af";
import {RouteService} from "../services/route.service";
import {DirectionsMapDirective} from "../directions-map.directive";
import {UserService} from "../services/user.service";

declare const google:any;
declare const jQuery:any;

@Component({
  selector: 'app-find-route',
  templateUrl: './find-route.component.html',
  styleUrls: ['./find-route.component.scss'],
  providers : [ GoogleMapsAPIWrapper ]
})

export class FindRouteComponent implements OnInit {
  private destinationToSave:any;
  private originToSave:any;
  private currentLat:number;
  private currentLng: number;
  public latitude: number;
  public longitude: number;

  public destinationInput: FormControl;
  public destinationOutput: FormControl;
  public zoom: number;
  //public iconurl: string;
  public mapCustomStyles : any;
  public estimatedTime: any;
  public estimatedDistance: any;

  public routes = [];
  public start: any;
  public end: any;
  public localIdx = 0;

  @ViewChild("pickupInput")
  public pickupInputElementRef: ElementRef;

  @ViewChild("pickupOutput")
  public pickupOutputElementRef: ElementRef;

  @ViewChild("scrollMe")
  private scrollContainer: ElementRef;

  @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;
  @ViewChild(DirectionsMapDirective) dmd: DirectionsMapDirective;

  public origin :any ; //aleatory position
  public destination : any; // aleatory position

  public neighbours = neighbours;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private gmapsApi: GoogleMapsAPIWrapper,
    private _elementRef : ElementRef,
    public afService: AF,
    public routeService: RouteService,
    private userService: UserService
    ) {
  }

  ngOnInit() {
    this.afService.af.auth.onAuthStateChanged((user)=>{
      console.log("as",user);
    });




    // HOW TO:
    // 
    // AT FIRST RUN, UNCOMMENT LOCALSTORAGE.CLEAR() AND ADD SOME ROUTES
    // UNCOMMENT IT, SAVE THE FILE, AND LOCALSTORAGE SHOUL WORK
    // AFTERWARDS KEEP IT UNCOMMENTED
    // ALL LOCAL STORAGE IS WIPED AT FIRST
    
    localStorage.clear();
    this.loadFromLocal();
    this.setLocalIdxOnLoad();

    //set current position
    this.setCurrentPosition();
    //set google maps defaults
    this.zoom = 13;
    this.latitude = 46.7700713; //Cluj-Napoca
    this.longitude = 23.590370300000018;
    //set current position
    this.setCurrentPosition();

    this.loadRoutes();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

      this.setupPlaceChangedListener('ORG');
      this.setupPlaceChangedListener('DES');
    });

  }
  private loadRoutes(){
     this.routes = this.routeService.readRoutes();
      console.log("ROUTES:",this.routes);
      // let r = { "origin" : route["origin"], "destination" : route["destination"] };
      // this.routes.push(route);
      // this.addToLocal(route);
      // console.log("ruta:",route);
      // var p1 = {'lat': route["origin"].latitude,'lng': route["origin"].longitude  }
      // var p2 = {'lat': route["destination"].latitude,'lng': route["destination"].longitude}
      // console.log(this.calculateDistance(p1,p2) + " meters");

  }

  private calculateDistance(coordDict1,coordDict2)
  {
    var temp1 = {'lat': 35, 'lng': 134}
    var temp2 = {'lat': 36, 'lng': 135}

    var rad = function(x) {
      return x * Math.PI / 180;
    };

    var getDistance = function(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2['lat'] - p1['lat']);
      var dLong = rad(p2['lng'] - p1['lng']);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1['lat'])) * Math.cos(rad(p2['lat'])) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };

    return getDistance(coordDict1,coordDict2)
  }

  private setLocalIdxOnLoad()
  {
    if (localStorage.getItem("localIdx") === null)
    {
      localStorage.setItem("localIdx",""+this.localIdx);
    }
    else
    {
      this.localIdx = parseInt(localStorage.getItem("localIdx"));
    }
  }

  private addToLocal(route)
  {
    this.localIdx = this.localIdx + 1;
    localStorage.setItem(""+this.localIdx , JSON.stringify(route));
    localStorage.setItem("localIdx",""+this.localIdx);
  }

  private loadFromLocal()
  {
    for (var i = 0; i < localStorage.length-1; i++)
    {
      var key = localStorage.key(i);
      this.routes.push(JSON.parse(localStorage.getItem(key)));
    }
  }

  tempClicked(i)
  {
    console.log(this.routes);
    this.vc.origin = { longitude: this.routes[i].origin.longitude, latitude: this.routes[i].origin.latitude };
    this.vc.originPlaceId = this.routes[i].origin.place_id;

    this.vc.destination = { longitude: this.routes[i].destination.longitude, latitude: this.routes[i].destination.latitude };
    this.vc.destinationPlaceId = this.routes[i].destination.place_id;

    if(this.vc.directionsDisplay === undefined)
    { 
      this.mapsAPILoader.load().then(() => {
        this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
      });
    }
    this.vc.updateDirections();
  }

  addRoute()
  {
    var p1 = {'lat': this.start.latitude,'lng': this.start.longitude}
    var p2 = {'lat': this.end.latitude,'lng': this.end.longitude}
    console.log(this.calculateDistance(p1,p2) + " meters");


    var route = { "origin" : this.start, "destination" : this.end };
    this.routes.push(route);
    this.addToLocal(route);
    console.log("ruta:",route);
    //this.saveRoute();
  }

  private saveRoute(){
    console.log("ROUTE:",this.originToSave,this.destinationToSave);
    this.routeService.saveRoute(this.originToSave,this.destinationToSave);
  }

  private setupPlaceChangedListener(mode: any ) {

        // if (mode === 'ORG') {
        //   this.routeService.readRoutes().then(r=>{
        //     var place = r.origin;
        //     console.log(place);
        //     this.vc.origin = { longitude: place.longitude, latitude: place.latitude };
        //     this.vc.originPlaceId = place.place_id;
        //     this.start = place;
        //
        //   });
        //
        // } else {
        //   this.routeService.readRoutes().then(r=>{
        //     let place = r.destination
        //     console.log(place);
        //     this.vc.destination = { longitude: place.longitude, latitude: place.latitude }; // its a example aleatory position
        //     this.vc.destinationPlaceId = place.place_id;
        //     this.end = place;
        //   });
        //
        // }

        if(this.vc.directionsDisplay === undefined){ this.mapsAPILoader.load().then(() => {
          this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
        });
      }

      //Update the directions
      this.vc.updateDirections();
      this.zoom = 12;


  }

  getDistanceAndDuration(){
    this.estimatedTime = this.vc.estimatedTime;
    this.estimatedDistance = this.vc.estimatedDistance;
  }

  scrollToBottom(): void {
    jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 3000);
  }

  private setPickUpLocation( place:any ) {
    //verify result
    if (place.geometry === undefined || place.geometry === null) {
      return;
    }
    //set latitude, longitude and zoom
    this.latitude = place.geometry.location.lat();
    this.longitude = place.geometry.location.lng();
    this.zoom = 12;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log("curr position:",position);
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.latitude;
        this.zoom = 12;
      });
    }
  }

  private getMapCusotmStyles() {

  }

}
