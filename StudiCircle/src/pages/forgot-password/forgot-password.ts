import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {ApiProvider} from "../../providers/api/api";
import {getMailRegex} from "../../util/stringUtils";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  public email_input: string;
  constructor(public navCtrl: NavController,
              private _api: ApiProvider) {
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

  public forgotPassword(): void {
    if(this.email_input){
      if(this.email_input.match(getMailRegex())){
        console.log("[FORGOTPW] : Valid E - Mail provided");
        const forgotPw : Subscription = this._api.forgotPassword(this.email_input).subscribe(
          (success: boolean) => {
            if (success) {
              console.log("[FORGOTPW] : Password reset successful");
              this.goToLogIn({});
            } else {
              console.log("[FORGOTPW] : Password reset failed");
            }
            forgotPw.unsubscribe();
            return success;
          }
        );
      }else{
        console.log("[FORGOTPW] : Invalid E - Mail provided");
      }
    }else{
      console.log("[FORGOTPW] : No E - Mail provided");
    }
  }
}
