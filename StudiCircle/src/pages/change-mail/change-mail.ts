import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { PassManPage } from '../pass-man/pass-man';
import { LogInPage } from '../log-in/log-in';
import { GetInvolvedPage } from '../get-involved/get-involved';
import { VerifyNowPage } from '../verify-now/verify-now';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-change-mail',
  templateUrl: 'change-mail.html'
})
export class ChangeMailPage {

  constructor(public navCtrl: NavController) {
  }
  goToSettings(params){
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }goToPassMan(params){
    if (!params) params = {};
    this.navCtrl.push(PassManPage);
  }goToLogIn(params){
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
  }goToChangeMail(params){
    if (!params) params = {};
    this.navCtrl.push(ChangeMailPage);
  }
}
