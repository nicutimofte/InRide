import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {DirectionsMapDirective} from "../directions-map.directive";
import {FormControl} from "@angular/forms";
import {MapsAPILoader, GoogleMapsAPIWrapper} from "angular2-google-maps/core";
import {AF} from "../providers/af";
import {RouteService} from "../services/route.service";
import {UserService} from "../services/user.service";
import {async} from "rxjs/scheduler/async";

@Component({
  selector: 'app-find-ride',
  templateUrl: './find-ride.component.html',
  styleUrls: ['./find-ride.component.scss'],
  providers : [ GoogleMapsAPIWrapper ]
})

export class FindRideComponent implements OnInit {
  private destinationToSave:any;
  private originToSave:any;
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

  constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private gmapsApi: GoogleMapsAPIWrapper,
      private _elementRef : ElementRef,
      public afService: AF,
      public routeService: RouteService
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
    //this.iconurl = '../image/map-icon.png';
    //this.iconurl = '../image/map-icon.png';

    // this.mapCustomStyles = this.getMapCusotmStyles();
    //create search FormControl
    this.destinationInput = new FormControl();
    this.destinationOutput = new FormControl();
    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setupPlaceChangedListener('ORG');
      this.setupPlaceChangedListener('DES');
    });
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
    this.vc.origin = { longitude: this.routes[i].origin.geometry.location.lng, latitude: this.routes[i].origin.geometry.location.lat };
    this.vc.originPlaceId = this.routes[i].origin.place_id;

    this.vc.destination = { longitude: this.routes[i].destination.geometry.location.lng, latitude: this.routes[i].destination.geometry.location.lat };
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
    var route = { "origin" : this.start, "destination" : this.end };
    this.routes.push(route);
    this.addToLocal(route);

    this.saveRoute();
  }

  private saveRoute(){
    console.log("ROUTE:",this.originToSave,this.destinationToSave);

    this.routeService.saveRoute(this.originToSave,this.destinationToSave);
  }

  private async setupPlaceChangedListener( mode: any ) {
    if (mode === 'ORG') {
      var place ;
      await this.routeService.readRoutes().then(r=> place = r.origin);
      console.log(place);
      this.vc.origin = { longitude: place.longitude, latitude: place.latitude };
      this.vc.originPlaceId = place.place_id;
      this.start = place;
      this.originToSave = place;
    } else {
      var place ;
      await this.routeService.readRoutes().then(r=> place = r.destination);
      console.log(place);
      this.vc.destination = { longitude: place.longitude, latitude: place.latitude };
      this.vc.destinationPlaceId = place.place_id;
      this.end = place;
      this.destinationToSave = place;
    }

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

  private getMapCusotmStyles() {

  }

}
