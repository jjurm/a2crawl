import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import { GeolocationPageModule } from '../geolocation/geolocation.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
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

  sendRequest(formValues) {
    // const url = `https://jsonplaceholder.typicode.com/todos/1`;  // get
    // var items = [];
    const url = `http://juraj.space:5000/data`;  // post
    var items= {
      start_location: formValues.source,
      end_location: formValues.destination,
      radius: formValues.interest,
      no_pubs: formValues.stops,
    };

    // POST request using JSON
    this.http.post(url, items).toPromise().then((data:any) => {
      // console.log(data);
      // console.log(data.json);
      // var jsonn = JSON.parse(data);
      this.calculateAndDisplayRoute(data, formValues)
      // console.log(jsonn)
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
      center: {lat: -34.397, lng: 150.644},
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
  // this will be the list of coordinates returned by the backend after the optimisation.
  // var listPos = [{
  //     lat: 48.8245306,
  //     lng: 2.40735,
  //   },
  //   {
  //     lat: 48.784,
  //     lng: 2.2743419,
  //   },
  // ];

  console.log("LIST POS:")
  console.log(listPos)
  console.log(listPos.length)
  
  var locations = []
  for (var i = 1; i < listPos.length-1; i++) {
    var point = new google.maps.LatLng(listPos[i]['lat'], listPos[i]['lng']);
    locations.push({location: point});
  
    // var start = new google.maps.LatLng(data[0][0], data[0][1]);
    // var end = new google.maps.LatLng(data[data.length][0], data[data.length][1]);

    const that = this;
    this.directionsService.route({
      // the origin and destination will come from the user input (text fields)
      origin: formValues.source,
      destination: formValues.destination,
      // origin: start,
      // destination: end,
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

// calculateAndDisplayRoute(formValues) {
//   // var start = new google.maps.LatLng(51.49602770000001, -0.1703533);
//   // var end = new google.maps.LatLng(51.4956583, -0.1452944);

//   const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
//     center: {lat: -34.397, lng: 150.644}, // random values, are not displayed anyway
//     zoom: 15
//   });

//   this.initMap(map)

//   var listPos = [{
//       arriveLat: 48.8245306,
//       arriveLng: 2.40735,
//       departLat: 48.799815,
//       departLng: 2.257289
//     },
//     {
//       arriveLat: 48.784,
//       arriveLng: 2.2743419,
//       departLat: 48.9016,
//       departLng: 2.29873
//     },
//   ];
//   var bounds = new google.maps.LatLngBounds();
//   for (var i = 0; i < listPos.length; i++) {

//     var startPoint = new google.maps.LatLng(listPos[i]['departLat'], listPos[i]['departLng']);
//     var endPoint = new google.maps.LatLng(listPos[i]['arriveLat'], listPos[i]['arriveLng']);
//     var directionsDisplay = new google.maps.DirectionsRenderer({
//       map: map,
//       preserveViewport: true
//     });
//     this.yallaCalculateAndDisplayRoute(this.directionsService, directionsDisplay, startPoint, endPoint, bounds, map);
//   }
// }

// yallaCalculateAndDisplayRoute(directionsService, directionsDisplay, startPoint, endPoint, bounds, map) {
//   directionsService.route({
//     origin: startPoint,
//     destination: endPoint,
//     travelMode: 'WALKING'
//   }, function(response, status) {
//     if (status === 'OK') {
//       directionsDisplay.setDirections(response);
//       bounds.union(response.routes[0].bounds);
//       map.fitBounds(bounds);
//     } else {
//       window.alert('Cannot find route' + status);
//     }
//   });
// }
}