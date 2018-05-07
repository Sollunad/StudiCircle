import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {Subscription} from "rxjs/Subscription";
import {ApiProvider} from "../../providers/api/api";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import {getMailRegex, stringHasAppropiateLength} from "../../util/stringUtils";
import {HttpErrorResponse} from '@angular/common/http';
import {ToastyProvider} from "../../providers/toasty/toasty";
import { ImpressumPage } from '../impressum/impressum';

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  public mail : string = '';
  public pw : string = '';

  constructor(public navCtrl: NavController, private _api : ApiProvider, private toasty : ToastyProvider) {

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
  goToImpressum(params){
    if (!params) params = {};
    this.navCtrl.push(ImpressumPage);
  }

  login(){
    if(!this.mail && !this.pw) {
      this.toasty.toast("Bitte gib eine E-Mail und ein Passwort ein!");
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
            if(data.status === 412) {
              this.toasty.toast("Dein Account wurde noch nicht freigeschaltet!");
            } else if(data.status === 451) {
              this.toasty.toast("Zu dieser E-Mail existiert kein Account!");
            } else if(data.status === 401) {
              this.toasty.toast("E-Mail oder Passwort falsch!");
            } else {
              this.toasty.toast("Etwas ist schief gelaufen!");
            }
            console.log("[LOGIN] : Login failed");
            loginSub.unsubscribe();
          }
        )
      }else{
        if(this.mail.length === 0){
          this.toasty.toast("Bitte gib eine E-Mail und ein Passwort ein!");
        }else if(this.pw.length === 0){
          this.toasty.toast("Bitte gib eine E-Mail und ein Passwort ein!");
        }
        console.log("[LOGIN] : Non-compliant E-Mail or Password")
      }
    }
  }
}
