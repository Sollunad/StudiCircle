import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {DbProvider} from "../../providers/dbprovider/dbprovider"

@Component({
  selector: 'page-circle-erstellen',
  templateUrl: 'circle-erstellen.html'
})
export class CircleErstellenPage {

  private visibility : string = "1";
  private newName : string = "";
  private newAddress : string = "";

  constructor(public navCtrl: NavController, private _circleService : CircleProvider, private alertCtrl: AlertController, private dbprovider: DbProvider) {
  }

  showExtraInfoName() {
    let alert = this.alertCtrl.create({
      title: 'Name',
      subTitle: 'Hier können sie einen beliebigen Namen für den Circle angeben unter dem dieser dann angezeigt wird',
      buttons: ['Okay']
    });
    alert.present();
  }

  showExtraInfoAdresse() {
    let alert = this.alertCtrl.create({
      title: 'Standort',
      subTitle: 'Hier können sie einen beliebigen Standort für den Circle angeben um Leute in der Umgebung darauf aufmerksam zu machen.',
      buttons: ['Okay']
    });
    alert.present();
  }

  showExtraInfoSichtbarkeit() {
    let alert = this.alertCtrl.create({
      title: 'Sichtbarkeit',
      subTitle: 'Hier können sie auswählen ob alle User ihren Circel sehen und ihm beitreten können (Öffentlich), oder ob das nur auf Einladung möglich sein soll (Privat)',
      buttons: ['Okay']
    });
    alert.present();
  }

  vis='1';

  onChange(){
    console.log(this.visibility);
    this.vis = this.visibility;
  }

  createCircle(){
    const response = this.dbprovider.getLocationByAddress(this.newAddress);
    const lat = response[0].lat;
    const lon = response[0].lon;
    const loc = {'lat' : lat, 'lon' : lon};
    console.log(this.vis, this.newName);
    const modification = this._circleService.create(this.newName, this.vis).subscribe(
      (success: boolean) => {
        if(success){
          console.log("[CREATE] : Circle created successful");
          modification.unsubscribe();
          return true;
        }else{
          console.log("[CREATE] : Circle created not successful");
          modification.unsubscribe();
          return false;
        }
      }
    )
  }

}
