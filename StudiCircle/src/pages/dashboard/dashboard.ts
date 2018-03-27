import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { SearchPage  } from '../search/search';
import { Geolocation } from '@ionic-native/geolocation'
import { DbProvider } from '../../providers/dbprovider/dbprovider';
import {CircleErstellenPage} from '../circle-erstellen/circle-erstellen';
import { AlertController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;
  clist:string[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dbprovider: DbProvider, private alertCtrl: AlertController, private http: HttpClient) {
      this.geolocation.getCurrentPosition().then((resp) => {
         let lat = resp.coords.latitude
         let long = resp.coords.longitude
         this.dbprovider.setLocation(lat, long)
        }).catch((error) => {
          console.log('Error getting location', error);
          this.showLocationPrompt();
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

  private showLocationPrompt() {
    this.alertCtrl.create({
      title: 'Enter Location',
      message: 'To use App, we need your location.',
      enableBackdropDismiss: false,
      inputs: [{
          name: 'location',
          placeholder: 'Location'
        }],
      buttons: [{
        text: 'OK',
        handler: data => {
          let address = data.location;
          this.getLocationByAddress(address);
          }
        }]
    }).present();
  }

  private getLocationByAddress(address: string) {
    this.http
      .get(`https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`)
      .map(res => res.json())
      .subscribe(data => {
        let json = data[0];
        if (!json) {
          this.showLocationPrompt();
        } else {
          this.dbprovider.setLocation(json.lat, json.lon);
        }
      });
  }

}
