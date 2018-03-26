import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from "../settings/settings";
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;

  constructor(public navCtrl: NavController) {

  }

  private goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage);
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }
}
