import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {ApiProvider} from "../../providers/api/api";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: UserInfo[];

  private circleId : number;
  private isAdminOrMod : boolean = false;
  private isAdmin : boolean = false;
  private currentUserId : number;


  constructor(public circleProvider: CircleProvider, public navCtrl: NavController, public alertCtrl: AlertController, public apiProvider: ApiProvider, public http: HttpClient, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
    this.currentUserId = Number(this.apiProvider.getCurrentUser().id);
  }

  ionViewDidLoad(){
    this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
    );
    this.circleProvider.getUserRole(this.circleId).subscribe(
      role => {
        if (role.role == "admin") {
          this.isAdminOrMod = true;
          this.isAdmin = true;
        }else if (role.role == "mod"){
          this.isAdminOrMod = true;
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
                this.reloadMemberList();
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
    this.circleProvider.changeRole(userId, circleId, "mod").subscribe(res => {
        this.reloadMemberList();
    });
  }

  demoteModerator(userId: number, circleId: number){
    this.circleProvider.changeRole(userId, circleId, "member").subscribe(res => {
        this.reloadMemberList();
    });
  }

  static itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  reloadMemberList(){
      this.memberList =[];
      this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
      );
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
        if(res==200){
          console.log("[Invitation] : Invitation sent successful");
          modification.unsubscribe();
        } else if (res.status==409){
          let alert = this.alertCtrl.create({
            title: 'Einladung fehlgeschlagen',
            subTitle: 'Es existiert kein registrierter User mit der E-Mail: '+ data,
            buttons: ['OK']
          });
          console.log("[Invitation] : Invitation sent not successful \n [ERROR-LOG]: ");
          console.log(res);
          alert.present();
          modification.unsubscribe();
        } else{
          console.log("[Invitation] : Invitation sent not successful \n [ERROR-LOG]: ");
          console.log(res);
          modification.unsubscribe();
        }
      }
    )
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);

  }

}
