import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
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
  { title: 'Rechnungen', component: '', imageName: 'rechnungen.jpg'},
  { title: 'Blackboard', component: '' , imageName: 'blackboard.jpg'},
  { title: 'Chat', component: '' , imageName: 'chat.jpg'},
  { title: 'Mitglieder', component: MitgliederÜbersicht ,imageName: 'mitglieder.jpg'},
  { title: 'Kalender', component: '' ,imageName: 'kalender.jpg'},
  { title: 'Wetten', component:'',imageName: 'wetten.jpg'},
  { title: 'File-Sharing', component:'',imageName: 'file-sharing.jpg'},
  { title: 'Flohmarkt', component:'',imageName: 'flohmarkt.jpg'},
  { title: 'Einstellungen', component:SettingsPage,imageName: 'einstellungen.jpg'}
];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
              public circleProvider:CircleProvider) {
    this.circleId = navParams.get('circleId');
    this.circleName = navParams.get('circleName');
  }

  ionViewDidLoad(){
    this.circleProvider.getModuleListByCircleId(this.circleId).subscribe(moduleList => {
     for(let i = 0; i < moduleList.length; i++){
       this.staticModules.forEach(module => {
         if(module.title == moduleList[i])
           this.moduleList.push(module)
       })
     }
    });
  }

  openPage(module) {
    this.navCtrl.push(module.component,{circleId: this.circleId});
  }
}
