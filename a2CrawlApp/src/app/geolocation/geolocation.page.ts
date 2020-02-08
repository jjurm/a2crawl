import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit, AfterViewInit {
  latitude: any;
  longitude: any;
  @ViewChild('mapElement', { static: true }) mapNativeElement: ElementRef;
  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    console.log("in ngOnInit")
  }

  ngAfterViewInit(): void {
    console.log("in ngAfterViewInit")
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
      });
      const infoWindow = new google.maps.InfoWindow;
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
