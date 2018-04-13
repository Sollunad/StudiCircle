import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {AlertController, NavController, NavParams, ViewController} from "ionic-angular";
import {DashboardPage} from "../dashboard/dashboard";
import {ApiProvider} from "../../providers/api/api";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: UserInfo[];

  private circleId : number;
  private isAdmin : boolean = false;
  private currentUserId : number;


  constructor(public circleProvider: CircleProvider, private viewCtrl: ViewController, public navCtrl: NavController, public alertCtrl: AlertController, public apiProvider: ApiProvider, public http: HttpClient, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
    this.currentUserId = Number(this.apiProvider.getCurrentUser().id);
  }

  ionViewDidLoad(){
    this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
    );
    this.circleProvider.checkIfAdmin(this.circleId).subscribe(
      role => {
        if (role.role == "admin") {
          this.isAdmin = true;
        }
      });
  }

  removeCircleMember(userId: number, circleId: number){
    let alert = this.alertCtrl.create({
      title: 'Benutzer wirklich löschen?',
      message: 'Möchten Sie den Benutzer wirklich aus dem Circle entfernen?',
      buttons: [
        {
          text: 'Entfernen',
          handler: () => {
            this.circleProvider.removeCircleMember(userId, circleId).subscribe(
              message => {
                console.log(message);
                this.memberList =[];
                this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
                  memberList => this.memberList = memberList
                );
              }
            );
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Benutzer löschen abgebrochen');
          }
        }
      ]
    });
    alert.present();
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
          handler: data => {
            console.log('Einladung gesendet!');
            this.invitation(data.mail);
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

  invitation(data: string){
    console.log("[E-Mail]: "+data);
    const modification = this.circleProvider.invite(this.circleId, data).subscribe(
      (res) => {
        if(res.info=="OK"){
          console.log("[Invitation] : Invitation sent successful");
          modification.unsubscribe();
          return true;
        }else{
          console.log("[Invitation] : Invitation sent not successful \n [ERROR-LOG]: ");
          console.log(res);
          modification.unsubscribe();
          return false;
        }
      }
    )
  }

}
