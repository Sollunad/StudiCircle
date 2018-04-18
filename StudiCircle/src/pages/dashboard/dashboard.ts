import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {SearchPage} from '../search/search';
import {Geolocation} from '@ionic-native/geolocation'
import {DbProvider} from '../../providers/dbprovider/dbprovider';
import {CircleErstellenPage} from '../circle-erstellen/circle-erstellen';
import {ApiProvider} from "../../providers/api/api";
import {Circle} from "../../providers/declarations/Circle";
import {Invitation} from "../../providers/declarations/Invitation";
import {CircleStartseite} from "../circle-startseite/circle-startseite";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;
  private circles : Circle[]=[];
  public invitList: Invitation[] = [
    {cId : 1, invitId : 1, cName: "Martin"},
    {cId : 2, invitId : 2, cName: "ist"},
    {cId : 3, invitId : 3, cName: "1 Kek"}
  ];
  private accountName : string;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dbprovider: DbProvider, private alertCtrl: AlertController, private api: ApiProvider, private circleProvider : CircleProvider) {
    this.getCurrentPosition();
    if(this.api.currentUser.username){
      this.accountName = this.api.currentUser.username.split(' ')[0];
    }
  }

  private getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((position) => {
      // console.log('position', position);
      let coords = position.coords;
      this.api.setLocation(coords.latitude, coords.longitude);
    }, (err) => {
      console.log('error', err);

      this.showLocationPrompt();
    });
  }

  goToStartPage(circleId: number, circleName: string) {
    this.navCtrl.push(CircleStartseite, {circleId: circleId, circleName: circleName});
  }

  goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage);
  }

  goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }

  onNewCircle() {
    this.navCtrl.push(CircleErstellenPage);
  }

  answerInvitation(iID: number, cID: number, answer: boolean){
    console.log("Answered on inviteID: " + iID + " for circleID: " + cID + " accepted invite: " + answer);
    /*this.circleProvider.answerInvite(iID, cID, answer).subscribe(data => console.log(data));*/
  }
  ionViewWillEnter() {
    this.circleProvider.getCircles().subscribe(data => {
      this.circles = data;
      // this.showCircle(data[0]);
    });
    /*this.circleProvider.getAllInvitsForUser().subscribe(
      invitList => this.invitList = invitList
    );*/
  }

  reactToInvit(circleId: number, invitId: number, status: boolean){
    this.circleProvider.answerInvite(circleId, invitId, status);
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
          this.dbprovider.getLocationByAddress(address).subscribe(geoResponses => {
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

}
