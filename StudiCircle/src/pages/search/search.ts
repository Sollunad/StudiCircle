import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  settings: SettingsPage;
  distanceValues = [
    '1 km',
    '5 km',
    '10 km',
    '20 km',
    '50 km',
    '∞'
  ];

  constructor(public navCtrl: NavController, private geo: Geolocation, private alertCtrl: AlertController, private http: Http) {
    this.getCurrentPosition();
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

  private distanceChanged(event: any) {
    // console.log(event);

    document.getElementById('search-distance').innerText = this.distanceValues[event.value];
  }

  private circleClicked(event: any) {
    console.log(event);
  }

  private getCircles(event: any) {
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
