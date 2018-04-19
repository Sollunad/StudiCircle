import {Component} from '@angular/core';
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
  private loc : any = "";

  constructor(public navCtrl: NavController, private _circleService : CircleProvider, private alertCtrl: AlertController, private dbprovider: DbProvider) {
  }

  showExtraInfoName() {
    this.showAlert('Name',
      'Hier können sie einen beliebigen Namen für den Circle angeben unter dem dieser dann angezeigt wird'
    );
  }

  showExtraInfoAdresse() {
    this.showAlert('Standort',
      'Hier können sie einen beliebigen Standort für den Circle angeben um Leute in der Umgebung darauf aufmerksam zu machen.'
    );
  }

  showExtraInfoSichtbarkeit() {
    this.showAlert('Sichtbarkeit',
      'Hier können sie auswählen ob alle User ihren Circel sehen und ihm beitreten können (Öffentlich), oder ob das nur auf Einladung möglich sein soll (Privat)'
    );
  }

  showAlert(title: string, subTitle: string) {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Okay']
    }).present();
  }

  vis='1';

  onChange(){
    console.log(this.visibility);
    this.vis = this.visibility;
  }

  createCircle(){
      this.dbprovider.getLocationByAddress(this.newAddress).subscribe(
        geoResponse => {
          const geoCoords = geoResponse[0];
          if (geoCoords === undefined) {
            console.log("undefined: " + geoCoords);
            this.showAlert('Fehler',
              'Bitte geben Sie eine gültige Adresse ein!'
            );
            return;
          }

          const lat = geoCoords.lat;
          const lon = geoCoords.lon;
          this.loc = {'lat': lat, 'lon': lon};
          console.log("lat lon von Adresse", this.loc);

          console.log(this.vis, this.newName, this.loc);
          const modification = this._circleService.create(this.newName, this.vis, this.loc).subscribe(
            res => {
                this.navCtrl.pop();
                if(res.info=="Circle created and User added."){
                  console.log("[Circle] : Create new Circle successful");
                  modification.unsubscribe();
                  return true;
                }else {
                  console.log("[Circle] : Create new Circle not successful \n [ERROR-LOG]: ");
                  console.log(res);
                  modification.unsubscribe();
                  return false;
                }
              });
      }
    )

  }

}
