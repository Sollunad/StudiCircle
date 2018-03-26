import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from "../settings/settings";
import { SearchPage } from '../search/search';
import { DbproviderProvider } from '../../providers/dbprovider/dbprovider';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  settings: SettingsPage;
  clist:string[];

  constructor(public navCtrl: NavController, private dbprovider: DbproviderProvider) {

  }

  private goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage);
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }

  ionViewWillEnter(){
    this.clist = this.dbprovider.getCircles();
    console.log("aufgerufen");
  }
}
