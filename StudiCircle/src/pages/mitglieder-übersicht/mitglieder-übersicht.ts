import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {AlertController, NavParams} from "ionic-angular";
import {DashboardPage} from "../dashboard/dashboard";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: UserInfo[];

  private circleId : number;
  private isAdmin : boolean;

  constructor(public circleProvider: CircleProvider, public alertCtrl: AlertController, public http: HttpClient, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
    this.isAdmin = navParams.get('isAdmin');
  }

  ionViewDidLoad(){
    this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
    );
  }

  removeCircleMember(userId: number, circleId: number){
    this.circleProvider.removeCircleMember(userId, circleId).subscribe();
    window.location.reload();
    }

  promoteToModerator(userId: number, circleId: number){
    this.circleProvider.changeRole(userId, circleId, "moderator").subscribe();
    window.location.reload();
  }

  demoteModerator(userId: number, circleId: number){
    this.circleProvider.changeRole(userId, circleId, "member").subscribe();
    window.location.reload();
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  openInviteDialog(){
    let alert = this.alertCtrl.create({
      title: 'Einladen',
      message: 'Wen einladen?',
      inputs: [
        {
          type: 'text',
          name: 'mail',
          placeholder: 'Emailadresse'
        }
      ],
      buttons: [
        {
          text: 'Einladung senden',
          handler: () => {
            console.log('Einladung gesendet!');
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Einladen abgebrochen');
          }
        }
      ]
    });
    alert.present();
  }
}
