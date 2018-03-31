import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { SearchPage } from "../search/search";
import {MitgliederÜbersicht} from "../mitglieder-übersicht/mitglieder-übersicht";
import {HttpClient} from "@angular/common/http";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  moduleList: Array<{title: string, component: any, imageName: string}> = [];

  circleId : number;

  circleName : string;

  staticModules = [
  { title: 'Rechnungen', mapName:'bill', component: '', imageName: 'rechnungen.jpg'},
  { title: 'Blackboard', mapName:'blackboard', component: SearchPage , imageName: 'blackboard.jpg'},
  { title: 'Chat', mapName:'chat', component: '' , imageName: 'chat.jpg'},
  { title: 'Mitglieder', mapName:'member', component: MitgliederÜbersicht ,imageName: 'mitglieder.jpg'},
  { title: 'Kalender', mapName:'calendar', component: '' ,imageName: 'kalender.jpg'},
  { title: 'Wetten', mapName:'bet', component:'',imageName: 'wetten.jpg'},
  { title: 'File-Sharing', mapName:'filesharing', component:'',imageName: 'file-sharing.jpg'},
  { title: 'Flohmarkt', mapName:'market', component:'',imageName: 'flohmarkt.jpg'},
  { title: 'Einstellungen', mapName:'settings', component:SettingsPage,imageName: 'einstellungen.jpg'}
];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
              public circleProvider:CircleProvider) {
    this.circleId = navParams.get('circleId');
    this.circleName = navParams.get('circleName');
  }

  ionViewDidLoad(){
    this.circleProvider.getModuleListByCircleId(1).subscribe(moduleList => {
      console.log(moduleList);
      this.staticModules.forEach(module =>{
        for(let entry of moduleList.modules) {
          if (module.mapName == entry)
            this.moduleList.push(module)
        }});
      });
    }

  openPage(module) {
    this.navCtrl.push(module.component,{circleId: this.circleId});
  }
}
