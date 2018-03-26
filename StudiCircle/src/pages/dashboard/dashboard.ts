import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from "../settings/settings";
import { SearchPage  } from '../search/search';
import { Geolocation } from '@ionic-native/geolocation'
import { DBProvider } from '../../providers/dbprovider/dbprovider'

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private database: DBProvider) {
      this.geolocation.getCurrentPosition().then((resp) => {
         let lat = resp.coords.latitude
         let long = resp.coords.longitude
         this.database.setLocation(lat, long)
        }).catch((error) => {
          console.log('Error getting location', error);
        });
  }

  private goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage);
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }


}
