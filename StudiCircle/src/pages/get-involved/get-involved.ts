import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VerifyNowPage } from '../verify-now/verify-now';
import { LogInPage } from '../log-in/log-in';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-get-involved',
  templateUrl: 'get-involved.html'
})
export class GetInvolvedPage {

  constructor(public navCtrl: NavController) {
  }
  goToVerifyNow(params){
    if (!params) params = {};
    this.navCtrl.push(VerifyNowPage);
  }goToLogIn(params){
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }goToGetInvolved(params){
    if (!params) params = {};
    this.navCtrl.push(GetInvolvedPage);
  }goToDashboard(params){
    if (!params) params = {};
    this.navCtrl.push(DashboardPage);
  }
}
