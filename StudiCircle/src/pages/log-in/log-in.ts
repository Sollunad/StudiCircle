import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {Subscription} from "rxjs/Subscription";
import {ApiProvider} from "../../providers/api/api";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import {getMailRegex, stringHasAppropiateLength} from "../../util/stringUtils";

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  public mail : '';
  public pw : '';
  private loginError : boolean;

  constructor(public navCtrl: NavController, private _api : ApiProvider) {

  }

  goToGetInvolved(params){
    if (!params) params = {};
    this.navCtrl.push(GetInvolvedPage);
  }
  goToVerifyNow(params){
    if (!params) params = {};
    this.navCtrl.push(VerifyNowPage);
  }
  goToLogIn(params){
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }
  goToDashboard(params){
    if (!params) params = {};
    this.navCtrl.push(DashboardPage);
  }
  goToForgotPassword(params){
    if (!params) params = {};
    this.navCtrl.push(ForgotPasswordPage);
  }

  login(){
    this.loginError = false;
    if(!this.mail && !this.pw) {
      console.log("[LOGIN] : Please provide an E-Mail as well as an Password");
    }else{
      if(this.mail.match(getMailRegex()) && stringHasAppropiateLength(this.pw,8,64)) {
        console.log("[LOGIN] : Logging in");
        const loginSub: Subscription = this._api.login(this.mail, this.pw).subscribe(
          (data: boolean) => {
            if (data) {
              this.goToDashboard({});
              loginSub.unsubscribe();
            } else {
              this.loginError = true;
              console.log("[LOGIN] : Login failed | loginError: " + this.loginError);
              loginSub.unsubscribe();
            }
          }
        )
      }else{
        console.log("[LOGIN] : Non-compliant E-Mail or Password")
      }
    }
  }
}
