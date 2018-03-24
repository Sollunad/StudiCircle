import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;

  constructor(public navCtrl: NavController, private geo: Geolocation, public alertCtrl: AlertController) {
    this.geo.getCurrentPosition().then((position) => {
      console.log(position);
      let coords = position.coords;

      this.alertCtrl.create({
        title: `Lat: ${coords.latitude}\nLon: ${coords.longitude}`,
        subTitle: '',
        buttons: ['OK']
      }).present();
    }, (err) => {
      console.log(err);

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please allow getting your location.',
        buttons: ['OK']
      }).present();
    });
  }

  goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }
}
