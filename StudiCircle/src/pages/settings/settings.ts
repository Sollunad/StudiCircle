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
  private accountName : string;
  constructor(public navCtrl: NavController,
              private _api: ApiProvider) {
    if(this._api.currentUser.username){
      this.accountName = this._api.currentUser.username;
    }
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
    if(this.pw_confirm){
      const deleteAccountSub: Subscription = this._api.deleteUser(this.pw_confirm).subscribe(
        (success: boolean) => {
          deleteAccountSub.unsubscribe();
          if(success) {
            console.log("[SETTINGS] : Account deletion successful");
            this.goToLogIn({});
          } else {
            console.log("[SETTINGS] : Account deletion failed");
          }
        }
      );
    }else{
      console.log("[SETTINGS] : No Password provided. Account not deleted");
    }
  }
}
