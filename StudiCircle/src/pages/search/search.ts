import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { DbProvider } from '../../providers/dbprovider/dbprovider';
// import { Circle } from '../../providers/declarations/Circle';
// import { CircleTest } from '../../../../Server/Database/circle.js';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  private distanceValues = [
    '1 km',
    '5 km',
    '10 km',
    '20 km',
    '50 km',
    '∞'
  ];
  circles: String[];

  constructor(public navCtrl: NavController, private geo: Geolocation, private alertCtrl: AlertController, private http: Http, private dbProvider: DbProvider) {
    this.getCurrentPosition();
    // CircleTest.Circle.create({
    //   name: 'Test',
    //   visibleble: true
    // });
  }

  private getCurrentPosition() {
    this.geo.getCurrentPosition().then((position) => {
      // console.log('position', position);
      let coords = position.coords;

      this.setUserCoordinates(coords.latitude, coords.longitude)
    }, (err) => {
      // console.log('error', err);

      this.showLocationPrompt();
    });
  }

  private setUserCoordinates(lat: number, lon: number) {
    document.getElementById('search-location').innerText = ` @ ${lat}, ${lon}`;

    this.circles = this.dbProvider.getCircles();
    // let circle = new Circle();
    // circle.position = { lat, lon };
    // this.circles.push(circle);
  }

  private showLocationPrompt() {
    this.alertCtrl.create({
      title: 'Location',
      message: 'Enter your location',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'location',
          placeholder: 'Location'
        },
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            // console.log('data', data);
            let address = data.location;

            this.getLocationByAddress(address);
          }
        }
      ]
    }).present();
  }

  private getLocationByAddress(address: string) {
    this.http
      .get(`https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`)
      .map(res => res.json())
      .subscribe(data => {
        let json = data[0];
        // console.log('json', json);

        if (json === undefined) {
          this.showLocationPrompt();
        } else {
          this.setUserCoordinates(json.lat, json.lon);
        }
      });
  }

  private distanceChanged(value: number) {
    // console.log(value);

    document.getElementById('search-distance').innerText = this.distanceValues[value];
  }

  private circleClicked(event: any) {
    console.log(event);
  }

  private searchCircles(event: any) {
    let value = event.target.value;

    if (value && value.trim() != '') {
      console.log('value', value);
    }
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }
}
