import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

export class Tab2Page implements OnInit, AfterContentInit {
  map;
  @ViewChild('mapElement', { static: true }) mapElement;
  constructor() {
  }

  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
  }
}