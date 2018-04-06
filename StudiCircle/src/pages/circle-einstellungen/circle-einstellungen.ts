import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'page-circle-einstellungen',
  templateUrl: 'circle-einstellungen.html'
})

export class CircleEinstellungenPage {

  private circleId : number;
  private visibility : string = "1";


  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private _circleService : CircleProvider) {
    this.circleId = navParams.get('circleId');
  }

  ionViewDidLoad() {
    console.log(this._circleService.getCircleVisibility(1).subscribe(actualvisibility =>
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

  id=this.circleId;
  vis='';

  onChange(){
    console.log(this.visibility);
    this.vis = this.visibility;
  }

  editVisibility(){
    console.log(this.vis);
    const modification = this._circleService.edit(1, this.vis).subscribe(
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
}
