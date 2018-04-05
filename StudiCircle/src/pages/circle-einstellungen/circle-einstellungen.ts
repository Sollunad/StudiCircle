import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {DashboardPage} from "../dashboard/dashboard";
import {AdminAuswaehlenPage} from "../admin-wählen/admin-auswählen";

@Component({
  selector: 'page-circle-einstellungen',
  templateUrl: 'circle-einstellungen.html'
})

export class CircleEinstellungenPage {

  circleId : number;
  circleName : string;
  private visibility : string = "1";


  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private _circleService : CircleProvider) {
    this.circleId = navParams.get('circleId');
    this.circleName = navParams.get('circleName');
  }

  ionViewDidLoad() {
    console.log(this._circleService.getCircleVisibility(this.circleId).subscribe(actualvisibility =>
    {
      if(actualvisibility){
        this.visibility = "1";
      } else {
        this.visibility = "0";
      }
    }
    ));
  }

  openConfirmDialog() {
    let alert = this.alertCtrl.create({
      title: 'Löschung bestätigen',
      message: 'Circle wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: () => {
            this.circleProvider.removeCircleByCircleId(this.circleId).subscribe(
              message => console.log(message)
            );
            this.navCtrl.push(DashboardPage);
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

  openConfirmDialog2() {
    let alert = this.alertCtrl.create({
      title: 'Änderung bestätigen',
      message: 'Sichtbarkeit wirklich ändern?',
      buttons: [
        {
          text: 'Speichern',
          handler: () => {
            console.log('gespeichert');
            this.editVisibility();
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('canceled');
          }
        }
      ]
    });
    alert.present();
  }

  onChange(){
    console.log(this.visibility);
  }

  editVisibility(){
    console.log(this.visibility);
    const modification = this._circleService.edit(this.circleId, this.visibility).subscribe(
    (success: boolean) => {
          if(success){
            console.log("[Visibility] : Visibility edit successful");
            modification.unsubscribe();
            return true;
          }else{
            console.log("[Visibility] : Visibility edit not successful");
            modification.unsubscribe();
            return false;
          }
      }
    )
  }

  openAdminSelect(){
    this.navCtrl.push(AdminAuswaehlenPage,{circleId: this.circleId, circleName: this.circleName});
  }

}
