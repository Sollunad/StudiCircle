import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {CircleStartseite} from "../circle-startseite/circle-startseite";

@Component({
  templateUrl: 'admin-auswählen.html'
})
export class AdminAuswaehlenPage {

  public memberList: UserInfo[];
  circleName: string = "";
  circleId : number;
  startIndex: number;

  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navParams: NavParams, private alertCtrl: AlertController, public navCtrl: NavController) {
    this.circleId = navParams.get('circleId');
    this.circleName = navParams.get('circleName');
  }

  ionViewDidLoad(){
    this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
    );
  }

  openConfirmDialog(userId: number, userName: string) {
    let alert = this.alertCtrl.create({
      title: 'Adminauswahl bestätigen',
      message: userName+' wirklich zum Admin machen? Mit dieser Auswahl werden die Adminrechte an '+userName+' weitergegeben.',
      buttons: [
        {
          text: 'Akzeptieren',
          handler: () => {
            this.circleProvider.selectNewAdmin(userId, this.circleId).subscribe(
              message => console.log(message)
            );
            //this.navCtrl.push(CircleStartseite, {circleId: this.circleId, circleName: this.circleName});
            this.navCtrl.remove(this.startIndex);
            this.navCtrl.pop().then(() => {
              this.navCtrl.pop();
            });
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Löschung abgebrochen');
          }
        }
      ]
    });
    alert.present();
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
