import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import { GeolocationPageModule } from '../geolocation/geolocation.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http'

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

export class Tab2Page implements OnInit, AfterViewInit {
  latitude: any;
  longitude: any;

  @ViewChild('mapElement', { static: true }) mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  constructor(private fb: FormBuilder, private geolocation: Geolocation, private http: HttpClient) {
    this.createDirectionForm();
  }

  ngOnInit() {
  }

  // sendRequest sends to our backend the information extracted from the user input 
  // and waits for a JSON back with the sequence of places to visit.
  sendRequest(formValues) {
    
    // 'interest' variable form user inputs indicates the extra time they are willing
    // to put into getting from point A to point B. We can use maths to convert that
    // into a distance (radius) to look for points of interest within.
    var extraDistance = (formValues.interest*60) * 2 

    const url = `http://www.juraj.space:5000/data`;  // post
    var items= {
      start_location: formValues.source,
      end_location: formValues.destination,
      radius: extraDistance,
      no_pubs: formValues.stops,
    };

    const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
          'Accept':'application/json',
          'content-type':'application/x-www-form-urlencoded'})
    };


    // POST request using JSON
    this.http.post(url, items).toPromise().then((data:any) => {
      this.calculateAndDisplayRoute(data, formValues)
    });

  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      interest: ['', Validators.required],
      stops: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      center: {lat: 51.498356, lng: -0.176894},
      zoom: 15
    });
    this.initMap(map)
  }

  initMap(map) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const infoWindow = new google.maps.InfoWindow;
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      map.setCenter(pos);
      // infoWindow.setPosition(pos);
      const icon = {
        url: 'assets/icon/u.png',
        scaledSize: new google.maps.Size(50, 50),
      };
      const marker = new google.maps.Marker ({
        position: pos,
        map: map,
        title: 'Hello Hello',
        icon: icon
      });
      const contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h1 id="firstHeading" class="firstHeading">Here you are</h1>' +
          '<div id="bodyContent">' +
          '<img src="assets/icon/u.png" width="200">' +
          '<p>We can say all the things we want to over here, ' +
          'maybe information about the location of the user </p>'
          '<p>Attribution: Uluru, <a href="https://en.wikipedia.org</a> ' +
          '(last visited June 22, 2019).</p>' +
          '</div>' +
          '</div>';
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
      this.directionsDisplay.setMap(map);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  calculateAndDisplayRoute(data, formValues) {

    console.log(data)
    var listPos = []
    for (var i = 0; i < data.length; i++) {
      listPos.push({lat: data[i][0], lng: data[i][1]});
    }

  console.log("LIST POS:")
  console.log(listPos)
  console.log(listPos.length)

  var locations = []
  for (var i = 1; i < listPos.length-1; i++) {
    var point = new google.maps.LatLng(listPos[i]['lat'], listPos[i]['lng']);
    locations.push({location: point});

    const that = this;
    this.directionsService.route({
      // the origin and destination will come from the user input (text fields)
      origin: formValues.source,
      destination: formValues.destination,
      // the waypoints come from the backend response (locations for loop above)
      waypoints: locations,
      travelMode: 'WALKING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
}
