import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {SearchPage} from '../search/search';
import {Geolocation} from '@ionic-native/geolocation'
import {DbProvider} from '../../providers/dbprovider/dbprovider';
import {CircleErstellenPage} from '../circle-erstellen/circle-erstellen';
import {ApiProvider} from "../../providers/api/api";
import {Circle} from "../../providers/declarations/Circle";
import {CircleStartseite} from "../circle-startseite/circle-startseite";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;
  private res: any;
  private circles : Circle[]=[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dbprovider: DbProvider, private alertCtrl: AlertController, private api: ApiProvider) {
    this.getCurrentPosition();
  }

  private getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((position) => {
      // console.log('position', position);
      let coords = position.coords;
      this.api.setLocation(coords.latitude, coords.longitude);
    }, (err) => {
      // console.log('error', err);

      this.showLocationPrompt();
    });
  }

  goToStartPage(circleId: number, circleName: string) {
    this.navCtrl.push(CircleStartseite, {circleId: circleId, circleName: circleName});
  }

  private goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage);
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }

  private onNewCircle() {
    this.navCtrl.push(CircleErstellenPage);
  }

  ionViewWillEnter() {
    this.circleProvider.getCircles().subscribe(data => {
      this.circles = data;
      // this.showCircle(data[0]);
    });
  }

  public showLocationPrompt() {
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
          this.dbProvider.getLocationByAddress(address).subscribe(geoResponses => {
            let json = geoResponses[0];

            if (json === undefined) {
              this.showLocationPrompt();
            } else {
              this.api.setLocation(json.lat, json.lon);
            }
          });
        }
      }]
    }).present();
  }

  private showCircle(circle: Circle){
    this.navCtrl.push(CircleStartseite, {
      circleId: circle.id,
      circleName: circle.name
    });
  }

}
