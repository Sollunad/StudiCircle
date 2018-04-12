import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {SearchPage} from '../search/search';
import {Geolocation} from '@ionic-native/geolocation'
import {DbProvider} from '../../providers/dbprovider/dbprovider';
import {CircleErstellenPage} from '../circle-erstellen/circle-erstellen';
import {HttpClient} from "@angular/common/http";
import {ApiProvider} from "../../providers/api/api";
import {Circle} from "../../providers/declarations/Circle";
import {CircleStartseite} from "../circle-startseite/circle-startseite";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  //providers: [CircleListProvider]
})
export class DashboardPage {

  settings: SettingsPage;
  private circles : Circle[]=[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dbProvider: DbProvider, private circleProvider: CircleProvider, private alertCtrl: AlertController, private http: HttpClient, private api: ApiProvider) {
    this.getCurrentPosition();
    this.getUserData();
    this.getCirclesByLocation();
     // this.api.setLocation(49.489591, 8.467236);
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






  private nonFilteredCircles = Array<Circle>();
  private lat: number;
  private lon: number;


  private getUserData() {
    const coords = this.api.getLocation();
    this.lat = coords.lat;
    this.lon = coords.lon;
  }

  private setCircles(circles: Circle[]) {

    this.circles = circles;
  }

  private getCirclesByLocation() {
    const dist = 10;
    this.circleProvider.getCirclesByLocation(this.lat, this.lon, dist).subscribe(
      circles => {
        // console.log('getCirclesByLocation', circles);
        this.nonFilteredCircles = circles;
        this.setCircles(circles);
      });
  }




  private circleClicked(circle: Circle) {
    console.log(circle);

    this.navCtrl.push(CircleStartseite, {
      circleId: circle.id,
      circleName: circle.name
    });
  }

  private joinCircle(circle: Circle) {
    console.log('joinCircle', circle);

    this.circleProvider.addUserToCircle(circle.id).subscribe(
      result => {
        console.log('joinCircle', result);
      });
  }





}
