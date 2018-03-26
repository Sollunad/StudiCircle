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

  constructor(public navCtrl: NavController, private geo: Geolocation, private alertCtrl: AlertController, private http: Http) {
    this.getCurrentPosition();
  }

  private getCurrentPosition() {
    this.geo.getCurrentPosition().then((position) => {
      // console.log('position', position);
      let coords = position.coords;

      this.showCoordsAlert(coords.latitude, coords.longitude)
    }, (err) => {
      // console.log('error', err);

      this.showLocationPrompt();
    });
  }

  private showCoordsAlert(lat: number, lon: number) {
    this.alertCtrl.create({
      title: `Lat: ${lat}\nLon: ${lon}`,
      subTitle: '',
      buttons: ['OK']
    }).present();

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
          this.showCoordsAlert(json.lat, json.lon);
        }
      });
  }

  getItems(ev: any) {
    console.log(ev);
    // Reset items back to all of the items
    // this.initializeItems();

    // set val to the value of the searchbar
    // let val = ev.target.value;
    //
    // // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    //   this.items = this.items.filter((item) => {
    //     return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }
}
