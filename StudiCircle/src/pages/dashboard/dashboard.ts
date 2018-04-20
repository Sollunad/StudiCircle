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
  public invitList: Invitation[];
  private accountName : string;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dbprovider: DbProvider, private alertCtrl: AlertController, private api: ApiProvider, private circleProvider : CircleProvider) {
    this.getCurrentPosition();
    if(this.api.currentUser.username){
      this.accountName = this.api.currentUser.username.split(' ')[0];
    }
  }

  ionViewWillEnter() {
    this.circleProvider.getCircles().subscribe(data => {
      this.circles = data;
      // this.showCircle(data[0]);
    });
    this.circleProvider.getAllInvitsForUser().subscribe(invitList => {
      this.invitList = invitList;
      console.log(this.invitList);
    });
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

  // Function to accept or deny Invitations
  answerInvitation(iId: number, cId: number, answer: number){
    var question;
    if (answer == 2){
      question = 'Do you really accept the invitation?';
    } else {
      question = 'Do you really decline the invitation?';
    }
    this.alertCtrl.create({
      title: 'Confirm Invitation Answer!',
      message: question,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.circleProvider.answerInvite(cId, iId, answer).subscribe(data => {
              console.log("Answered on inviteID: " + iId + " for circleID: " + cId + " accepted invite: " + answer);
              if(data.status!=200){
                console.log("[Response]:"+data.statusText);
                let alert = this.alertCtrl.create({
                  title: 'Fehler',
                  subTitle: 'Bei der Verarbeitung der Anfrage lief etwas schief',
                  buttons: ['OK']
                });
                alert.present();
              }else{
                console.log("[Response]:"+data.statusText);
              }
            }
          );
        }
      },{
        text: 'Abbrechen',
        role: 'cancel',
        handler: () => {
          console.log('Answer invite canceled');
        }
      }]
    }).present();

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
