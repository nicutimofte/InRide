import { Component, OnInit } from '@angular/core';
declare const google: any;
@Component({
  selector: 'app-map-test',
  templateUrl: './map-test.component.html',
  styleUrls: ['./map-test.component.scss']
})
export class MapTestComponent implements OnInit {
  directionsService: any;
  directionsDisplay: any;
  map: any;

  constructor() { }

  ngOnInit() {

    //this.initialize();

  }
  // initialize() {
  //   let directionsService = new google.maps.DirectionsService();
  //   let directionsDisplay = new google.maps.DirectionsRenderer();
  //   var chicago = new google.maps.LatLng(37.334818, -121.884886);
  //   var mapOptions = {
  //     zoom: 7,
  //     center: chicago
  //   };
  //   this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  //   directionsDisplay.setMap(this.map);
  //   google.maps.event.addDomListener(document.getElementById('routebtn'), 'click', this.calcRoute(directionsDisplay,directionsService));
  // }
  // calcRoute(directionsDisplay, directionsService) {
  //   console.log("yes");
  //   var start = new google.maps.LatLng(37.334818, -121.884886);
  //   //var end = new google.maps.LatLng(38.334818, -181.884886);
  //   var end = new google.maps.LatLng(37.441883, -122.143019);
  //   var request = {
  //     origin: start,
  //     destination: end,
  //     travelMode: google.maps.TravelMode.DRIVING
  //   };
  //   directionsService.route(request, function(response, status) {
  //     if (status == google.maps.DirectionsStatus.OK) {
  //       directionsDisplay.setDirections(response);
  //       directionsDisplay.setMap(this.map);
  //     } else {
  //       alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
  //     }
  //   });
  // }

}
