import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {AlertController, NavController, NavParams, ViewController} from "ionic-angular";

@Component({
  templateUrl: 'admin-auswählen.html'
})
export class AdminAuswaehlenPage {

  public memberList: UserInfo[];
  circleId : number;
  private uId : number;

  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navParams: NavParams, private alertCtrl: AlertController, public navCtrl: NavController, public viewCtrl: ViewController) {
    this.circleId = navParams.get('circleId');
  }

  ionViewDidLoad(){
    this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
    );
  }

  openConfirmDialog(userId: number, userName: string) {
    console.log("[Auswahl bestätigen]: "+userId, userName);
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
            this.navCtrl.remove(this.viewCtrl.index-1);
            this.navCtrl.pop();
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Adminauswahl abgebrochen');
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
