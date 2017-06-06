import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {GoogleMapsAPIWrapper, MapsAPILoader} from "angular2-google-maps/core";
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router'

import {} from '@types/googlemaps';
import {neighbours} from './mockData/neighbours.mock';
import {AF} from "../providers/af";
import {RouteService} from "../services/route.service";
import {UserRoutesService} from "../services/userRoutes.service"
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
    private userService: UserService,
    private usersRouteSerice: UserRoutesService,
    private router:Router
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

    this.loadRoutes(()=>{
      console.log("ROUTES:",this.routes);
      this.routes.map((route)=>{
        let p1 = {'lat': this.latitude,'lng': this.longitude}
        let p2 = {'lat': route.origin.latitude , 'lng': route.origin.longitude}
        let distance = this.calculateDistance(p1,p2);
        console.log("DISTANCE;",distance.toFixed(2) + " meters")
        route.distance = distance.toFixed(2);
      });
    });

    console.log('current place:',this.latitude,this.longitude)
    // this.routes.forEach((route)=>{
    //   let p1 = {'lat': this.latitude,'lng': this.longitude}
    //   let p2 = {'lat': route.origin.latitude , 'lng': route.origin.longitude}
    //   let distance = this.calculateDistance(p1,p2);
    //   console.log("distance;",distance.toFixed(2) + " meters")
    //   route.distance = distance.toFixed(2);
    // });
    //
  }
  private loadRoutes(callback){
     this.routes = this.routeService.readRoutes();

      callback();
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
        this.zoom = 12;
      });
    }
  }

  private attendRoute(id){
    var userId
    console.log(this.routes[id].rid)
    this.router.navigate(["profile"])
    this.userService.readUser().then(user=>{
        userId = user.uid
        this.usersRouteSerice.saveUserRoute(this.routes[id].rid,userId)
    });



  }

  private getMapCusotmStyles() {

  }

}
