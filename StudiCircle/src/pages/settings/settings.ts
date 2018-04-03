import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PassManPage} from '../pass-man/pass-man';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {ChangeMailPage} from '../change-mail/change-mail';
import {ApiProvider} from "../../providers/api/api";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public pw_confirm: string;
  constructor(public navCtrl: NavController,
              private _api: ApiProvider) {
  }
  goToPassMan(params){
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
  }goToSettings(params){
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }

  public deleteAccount(): void {
    const deleteAccountSub: Subscription = this._api.deleteUser(this.pw_confirm).subscribe(
      (success: boolean) => {
        deleteAccountSub.unsubscribe();
        if(success) {
          console.log("Account deletion successful!");
          this.goToLogIn({});
        } else {
          console.log("Account deletion FAILED using password " + this.pw_confirm + "!");
        }
      }
    );
  }
}
