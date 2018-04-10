import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {SearchPage} from "../search/search";
import {MitgliederÜbersicht} from "../mitglieder-übersicht/mitglieder-übersicht";
import {HttpClient} from "@angular/common/http";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {CircleEinstellungenPage} from "../circle-einstellungen/circle-einstellungen";

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  moduleList: Array<{title: string, mapName:string, component: any, imageName: string}> = [
    { title: 'Blackboard', mapName:'blackboard', component: SearchPage , imageName: 'blackboard.jpg'},
    { title: 'Chat', mapName:'chat', component: '' , imageName: 'chat.jpg'}
  ];

  circleId : number;

  circleName : string;
  private checkRole : boolean;

  staticModules = [
  { title: 'Rechnungen', mapName:'bill', component: '', imageName: 'rechnungen.jpg'},
  { title: 'Kalender', mapName:'calendar', component: '' ,imageName: 'kalender.jpg'},
  { title: 'Wetten', mapName:'bet', component:'',imageName: 'wetten.jpg'},
  { title: 'File-Sharing', mapName:'filesharing', component:'',imageName: 'file-sharing.jpg'},
  { title: 'Flohmarkt', mapName:'market', component:'',imageName: 'flohmarkt.jpg'}
];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
              public circleProvider:CircleProvider, public alertCtrl: AlertController) {
    this.circleId = navParams.get('circleId');
    this.circleName = navParams.get('circleName');
  }

  ionViewDidLoad(){
    this.circleProvider.getModuleListByCircleId(this.circleId).subscribe(moduleList => {
      console.log(moduleList);
      this.staticModules.forEach(module =>{
        for(let entry of moduleList) {
          if (module.mapName == entry)
            this.moduleList.push(module)
        }});
      this.moduleList.push({ title: 'Mitglieder', mapName:'member', component: MitgliederÜbersicht ,imageName: 'mitglieder.jpg'});
      this.moduleList.push({ title: 'Einstellungen', mapName:'settings', component:CircleEinstellungenPage,imageName: 'einstellungen.jpg'});
      });

    this.circleProvider.checkIfAdmin(this.circleId).subscribe(
      role => {
        if (role.role=="admin") {
          console.log("[ROLE] : "+role.role);
          this.checkRole=true;
        } else {
          console.log("[ROLE] : "+role.role);
          console.log(role);
          this.checkRole=false;
        }
      }
    );
    }

  openPage(module) {
    this.navCtrl.push(module.component,{circleId: this.circleId});
  }



  openConfirmDialog(){
    if (this.checkRole){
      let alert = this.alertCtrl.create({
        title: 'Verlassen nicht möglich!',
        subTitle: 'Verlassen von '+this.circleName+' nicht möglich! Vor dem Verlassen müssen die Adminrechte weitergegeben werden.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      console.log("async");
      let alert = this.alertCtrl.create({
        title: 'Verlassen bestätigen',
        message: this.circleName+' wirklich verlassen?',
        buttons: [
          {
            text: 'Verlassen',
            handler: () => {
              this.circleProvider.leaveCircle(this.circleId).subscribe(
                message => console.log(message)
              );
              this.navCtrl.pop();
            }
          },
          {
            text: 'Abbrechen',
            role: 'cancel',
            handler: () => {
              console.log('Verlassen abgebrochen');
            }
          }
        ]
      });
      alert.present();
    }
  }

}
