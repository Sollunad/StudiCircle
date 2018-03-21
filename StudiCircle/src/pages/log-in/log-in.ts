import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GetInvolvedPage } from '../get-involved/get-involved';
import { VerifyNowPage } from '../verify-now/verify-now';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  constructor(public navCtrl: NavController) {
  }
  goToGetInvolved(params){
    if (!params) params = {};
    this.navCtrl.push(GetInvolvedPage);
  }goToVerifyNow(params){
    if (!params) params = {};
    this.navCtrl.push(VerifyNowPage);
  }goToLogIn(params){
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }goToDashboard(params){
    if (!params) params = {};
    this.navCtrl.push(DashboardPage);
  }
}
