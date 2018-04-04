import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {DbProvider} from "../../providers/dbprovider/dbprovider"
import {convertDeepLinkConfigEntriesToString} from "@ionic/app-scripts/dist/deep-linking/util";

@Component({
  selector: 'page-circle-erstellen',
  templateUrl: 'circle-erstellen.html'
})
export class CircleErstellenPage {

  private visibility : string = "1";
  private newName : string = "";
  private newAddress : string = "";
  private loc : any = "";

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
    if (this.newAddress==="") {
      console.log("Keine Adresse angegeben");
      this.loc = null;
    } else {
      this.dbprovider.getLocationByAddress(this.newAddress).subscribe(
        responsefile => {
          if (responsefile[0] === undefined) {
            console.log("undefined: " + responsefile[0]);
            this.loc = null;
          } else {
            const lat = responsefile[0].lat;
            const lon = responsefile[0].lon;
            this.loc = {'lat': lat, 'lon': lon};
          }
        });
    }
    console.log(this.vis, this.newName, this.loc);
    const modification = this._circleService.create(this.newName, this.vis, this.loc).subscribe(
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
