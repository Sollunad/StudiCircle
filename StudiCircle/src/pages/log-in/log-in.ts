import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GetInvolvedPage } from '../get-involved/get-involved';
import { VerifyNowPage } from '../verify-now/verify-now';
import { DashboardPage } from '../dashboard/dashboard';
import {Subscription} from "rxjs/Subscription";
import {ApiProvider} from "../../providers/api/api";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  mail : '';
  pw : '';

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
    if(!this.mail && !this.pw) {
      console.log("[LOGIN] : Please provide an E-Mail as well as an Password");
    }else{
      if(this.mail.match('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$') && this.pw.match('[(\\w+\\W+\\d+)]{8,64}')) {
        console.log("[LOGIN] : Logging in");
        const loginSub: Subscription = this._api.login(this.mail, this.pw).subscribe(
          (data: boolean) => {
            if (data) {
              this.goToDashboard({});
              loginSub.unsubscribe();
            } else {
              console.log("[LOGIN] : Login failed");
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
