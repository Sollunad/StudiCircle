import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings : SettingsPage;

  constructor(public navCtrl: NavController) {
  }

  goToSettings(params){
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }
}
