import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from "../settings/settings";
import { SearchPage  } from '../search/search';
import { Geolocation } from '@ionic-native/geolocation'
import { DBProvider } from '../../providers/dbprovider/dbprovider'
<<<<<<< HEAD
import { SearchPage } from '../search/search';
<<<<<<< HEAD
import { DbproviderProvider } from '../../providers/dbprovider/dbprovider';
=======
=======
>>>>>>> 406d1dd920fc5cdda402f72262cff9ad9352aca0
import { circleErstellen} from '../circleErstellen/circleErstellen';
>>>>>>> 8e5417bd3dcd0948ca91d5348d69b29827899fcd

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;
  clist:string[];

<<<<<<< HEAD
  constructor(public navCtrl: NavController, private dbprovider: DbproviderProvider) {

=======
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private database: DBProvider) {
      this.geolocation.getCurrentPosition().then((resp) => {
         let lat = resp.coords.latitude
         let long = resp.coords.longitude
         this.database.setLocation(lat, long)
        }).catch((error) => {
          console.log('Error getting location', error);
        });
>>>>>>> 8e5417bd3dcd0948ca91d5348d69b29827899fcd
  }

  private goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage);
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }private onNewCircle(){
    this.navCtrl.push(circleErstellen);
  }

<<<<<<< HEAD
  ionViewWillEnter(){
    this.clist = this.dbprovider.getCircles();
    console.log("aufgerufen");
  }
=======

>>>>>>> 8e5417bd3dcd0948ca91d5348d69b29827899fcd
}
