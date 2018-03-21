import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  SettingsButton : any;

  constructor(public navCtrl: NavController) {
    this.SettingsButton = SettingsPage;
  }

}
