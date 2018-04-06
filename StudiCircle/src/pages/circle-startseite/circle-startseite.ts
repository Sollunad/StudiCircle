import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {SearchPage} from "../search/search";
import {MitgliederÜbersicht} from "../mitglieder-übersicht/mitglieder-übersicht";
import {HttpClient} from "@angular/common/http";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {CircleEinstellungenPage} from "../circle-einstellungen/circle-einstellungen";
import {BlackboardPage} from "../blackboard/blackboard";

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  moduleList: Array<{title: string, mapName:string, component: any, imageName: string}> = [
    { title: 'Blackboard', mapName:'blackboard', component: BlackboardPage , imageName: 'blackboard.jpg'},
    { title: 'Chat', mapName:'chat', component: '' , imageName: 'chat.jpg'}
  ];

  circleId : number;

  circleName : string;

  staticModules = [
  { title: 'Rechnungen', mapName:'bill', component: '', imageName: 'rechnungen.jpg'},
  { title: 'Kalender', mapName:'calendar', component: '' ,imageName: 'kalender.jpg'},
  { title: 'Wetten', mapName:'bet', component:'',imageName: 'wetten.jpg'},
  { title: 'File-Sharing', mapName:'filesharing', component:'',imageName: 'file-sharing.jpg'},
  { title: 'Flohmarkt', mapName:'market', component:'',imageName: 'flohmarkt.jpg'}
];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
              public circleProvider:CircleProvider) {
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
    }

  openPage(module) {
    this.navCtrl.push(module.component,{circleId: this.circleId});
  }
}
