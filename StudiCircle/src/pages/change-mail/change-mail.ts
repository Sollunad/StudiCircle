import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { PassManPage } from '../pass-man/pass-man';
import { LogInPage } from '../log-in/log-in';
import { GetInvolvedPage } from '../get-involved/get-involved';
import { VerifyNowPage } from '../verify-now/verify-now';
import { DashboardPage } from '../dashboard/dashboard';
import {ApiProvider} from "../../providers/api/api";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-change-mail',
  templateUrl: 'change-mail.html'
})
export class ChangeMailPage {

  private oldMail : string;
  private newMail : string;
  private chkNewMail : string;
  private pwd : string;

  constructor(public navCtrl: NavController, private _api : ApiProvider) {
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

  onButtonClick(){
    const requestMailChange : Subscription = this._api.changeMail(this.newMail, this.pwd).subscribe(
      (data: boolean) => {
        if (data) {
          this.goToSettings({});
          requestMailChange.unsubscribe();
        } else {
          console.log("[LOGIN] : Login failed");
          requestMailChange.unsubscribe();
        }
      }
    );

  }
}
