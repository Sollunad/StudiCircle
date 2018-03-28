import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {ApiResponse} from "../../providers/declarations/ApiResponse";
import {UserInfo} from "../../providers/declarations/UserInfo";
import { CircleProvider } from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'page-circle-einstellungen',
  templateUrl: 'circle-einstellungen.html'
})

export class CircleEinstellungenPage {

  private circleId : number;

  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
  }

  openConfirmDialog() {
    let alert = this.alertCtrl.create({
      title: 'Löschung bestätigen',
      message: 'Circle wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: () => {
            this.circleProvider.removeCircleByCircleId(1).subscribe( //TO-DO: circleId übergeben!
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

  id='';
  vis='';
  editVisibility(){
    const modification = this.circleProvider.edit(this.id, this.vis).subscribe(
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
