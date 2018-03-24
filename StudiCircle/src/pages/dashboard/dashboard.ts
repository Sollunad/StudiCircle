import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { CircleListProvider } from '../../providers/circle-list/circle-list';
import { Observable } from 'rxjs';
//import { AddCirclePage } from ../....;

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [CircleListProvider]
})
export class DashboardPage {

  settings : SettingsPage;

  circle_list:string[];

  constructor(public navCtrl: NavController, private circleProvider: CircleListProvider) {
  }

  goToSettings(params){
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }

  addCircle(){
    //this.navCtrl.push(SettingsPage);
    console.log("addCircle geklickt");
      //TODO Forwarding auf AddCirclePage
  }

  ionViewWillEnter(){
    this.circle_list = this.circleProvider.getCircleList();
  }

}
