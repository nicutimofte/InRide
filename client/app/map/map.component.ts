import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {GoogleMapsAPIWrapper, MapsAPILoader} from "angular2-google-maps/core";
import {FormControl} from "@angular/forms";
import {DirectionsMapDirective} from "./directions-map.directive";
import {} from '@types/googlemaps';
import {neighbours} from './mockData/neighbours.mock';
import {AF} from "../providers/af";

declare const google:any;
declare const jQuery:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers : [ GoogleMapsAPIWrapper ]
})

export class MapComponent implements OnInit {
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
    public afService: AF
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
      let autocompleteInput = new google.maps.places.Autocomplete(this.pickupInputElementRef.nativeElement, {
        types: ["address"]
      });

      let autocompleteOutput = new google.maps.places.Autocomplete(this.pickupOutputElementRef.nativeElement, {
        types: ["address"]
      });

      this.setupPlaceChangedListener(autocompleteInput, 'ORG');
      this.setupPlaceChangedListener(autocompleteOutput, 'DES');
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
  }

  private setupPlaceChangedListener(autocomplete: any, mode: any ) {
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        console.log('place:',place);
        //verify result
        if (place.geometry === undefined) {
          return;
        }
        if (mode === 'ORG') {
          this.vc.origin = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() };
          this.vc.originPlaceId = place.place_id;
          this.start = place;
        } else {
          this.vc.destination = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; // its a example aleatory position
          this.vc.destinationPlaceId = place.place_id;
          this.end = place;
        }

        if(this.vc.directionsDisplay === undefined){ this.mapsAPILoader.load().then(() => {
          this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
        });
      }

      //Update the directions
      this.vc.updateDirections();
      this.zoom = 12;
    });

    });

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

  private getMapCusotmStyles() {

  }

}
