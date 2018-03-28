import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {ApiResponse} from "../../providers/declarations/ApiResponse";
import {UserInfo} from "../../providers/declarations/UserInfo";
import { CircleProvider } from "../../providers/circle-provider/CircleProvider";
import {NavParams} from "ionic-angular";


@Component({
  selector: 'page-circle-einstellungen',
  templateUrl: 'circle-einstellungen.html'
})

export class CircleEinstellungenPage {

  private  circleId : number;

  public visibility : string = "test";

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private _circleService : CircleProvider, public navParams: NavParams) {
    this.circleId = navParams.get('circleId')
  }

  openConfirmDialog() {
    let alert = this.alertCtrl.create({
      title: 'Löschung bestätigen',
      message: 'Circle wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: () => {
            console.log('Circle gelöscht');
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
    console.log(this.vis)
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
