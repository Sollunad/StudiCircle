import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
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
            this.circleProvider.removeCircleByCircleId(this.circleId).subscribe(
              message => console.log(message)
            );
            console.log('Johannes Circle gelöscht');
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
}
