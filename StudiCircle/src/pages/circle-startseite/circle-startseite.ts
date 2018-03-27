import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import {MitgliederÜbersicht} from "../mitglieder-übersicht/mitglieder-übersicht";

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  pages: Array<{title: string, component: any, imageName: string}>;

  circleId : number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = [
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

    this.circleId = navParams.get('circleId');
  }

  openPage(page) {
    this.navCtrl.push(page.component,{circleId: this.circleId});
  }
}
