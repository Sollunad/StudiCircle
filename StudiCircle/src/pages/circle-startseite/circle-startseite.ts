import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import {MitgliederÜbersicht} from "../mitglieder-übersicht/mitglieder-übersicht";

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  settings : SettingsPage;

  constructor(public navCtrl: NavController) {
  }

  openSubPage(id: number){
    this.navCtrl.push(MitgliederÜbersicht)
  }
}
