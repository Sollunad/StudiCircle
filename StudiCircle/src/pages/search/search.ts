import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { DbProvider } from '../../providers/dbprovider/dbprovider';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  search: '';
  distance: 0;

  private distanceValues = [
    '1 km',
    '5 km',
    '10 km',
    '20 km',
    '50 km',
    '∞'
  ];
  private lat: number;
  private lon: number;

  circles: String[];

  constructor(public navCtrl: NavController, private geo: Geolocation, private alertCtrl: AlertController, public http: HttpClient, private dbProvider: DbProvider) {
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
    this.lat = lat;
    this.lon = lon;
    document.getElementById('search-location').innerText = ` @ ${lat}, ${lon}`;

    /*this.circles = this.dbProvider.getCircles();

    this.dbProvider.getCirclesByLocation(lat, lon).subscribe(
      circles => console.log('getCirclesByLocation', circles)
    );*/
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

  private distanceChanged() {
    // console.log(this.distance);

    document.getElementById('search-distance').innerText = this.distanceValues[this.distance];

    // TODO: filter circles by distance
  }

  private circleClicked(event: any) {
    console.log(event);

    // TODO: go to circle details
  }

  private searchCircles() {
    let value = this.search.trim();

    if (value && value != '') {
      console.log('value', value);

      // TODO: filter circles by name
    } else {
      console.log('value', 'empty');
      // TODO: view all circles
    }
  }

  private goToSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
