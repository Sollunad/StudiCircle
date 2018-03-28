import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { SearchPage  } from '../search/search';
import { Geolocation } from '@ionic-native/geolocation'
import { DbProvider } from '../../providers/dbprovider/dbprovider';
import {CircleErstellenPage} from '../circle-erstellen/circle-erstellen';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;
  clist:string[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dbprovider: DbProvider) {
      this.geolocation.getCurrentPosition().then((resp) => {
         let lat = resp.coords.latitude
         let long = resp.coords.longitude
         this.dbprovider.setLocation(lat, long)
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

 private onNewCircle(){
    this.navCtrl.push(CircleErstellenPage);
  }

  // Calculation the distance between two points
  private calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }

  ionViewWillEnter(){
    this.clist = this.dbprovider.getCircles();
    console.log("aufgerufen");
  }


}
