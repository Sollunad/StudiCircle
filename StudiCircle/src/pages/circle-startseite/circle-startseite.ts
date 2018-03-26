import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  settings : SettingsPage;

  constructor(public navCtrl: NavController) {
  }

  goToSettings(params){
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }
}
