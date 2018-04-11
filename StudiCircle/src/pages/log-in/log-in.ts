import {Component} from '@angular/core';
import {ToastController} from 'ionic-angular';
import {NavController} from 'ionic-angular';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {Subscription} from "rxjs/Subscription";
import {ApiProvider} from "../../providers/api/api";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import {getMailRegex, stringHasAppropiateLength} from "../../util/stringUtils";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  public mail : '';
  public pw : '';

  constructor(public navCtrl: NavController, private _api : ApiProvider, private toastCtrl: ToastController) {

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
      if(this.mail.match(getMailRegex()) && stringHasAppropiateLength(this.pw,8,64)) {
        console.log("[LOGIN] : Logging in");
        const loginSub: Subscription = this._api.login(this.mail, this.pw).subscribe(
          (data: number) => {
            console.log("[LOGIN] : Login successful");
            this.goToDashboard({});
            loginSub.unsubscribe();
          },
          (data: HttpErrorResponse) => {            
            if(data.status === 400 || data.status === 401){
              this.createToast("Wrong password or e-mail address!");
            } else if (data.status === 412) {
              this.createToast("Your Account is not yet activated!");
            } else {
              this.createToast("Something went wrong!");
            }
            console.log("[LOGIN] : Login failed");
            loginSub.unsubscribe();
          }
        )
      }else{
        console.log("[LOGIN] : Non-compliant E-Mail or Password")
      }
    }
  }

  createToast(toastMessage: string) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: "dismiss"
    });
  
    toast.present();
  }
}
