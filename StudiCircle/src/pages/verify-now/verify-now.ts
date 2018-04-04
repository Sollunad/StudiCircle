import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {DashboardPage} from '../dashboard/dashboard';

@Component({
  selector: 'page-verify-now',
  templateUrl: 'verify-now.html'
})
export class VerifyNowPage {

  constructor(public navCtrl: NavController) {
  }
  goToLogIn(params){
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }goToGetInvolved(params){
    if (!params) params = {};
    this.navCtrl.push(GetInvolvedPage);
  }goToVerifyNow(params){
    if (!params) params = {};
    this.navCtrl.push(VerifyNowPage);
  }goToDashboard(params){
    if (!params) params = {};
    this.navCtrl.push(DashboardPage);
  }
}
