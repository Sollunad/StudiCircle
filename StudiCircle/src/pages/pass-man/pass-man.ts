import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {ApiProvider} from "../../providers/api/api";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-pass-man',
  templateUrl: 'pass-man.html'
})
export class PassManPage {

  pw_old : '';
  pw_new : '';
  pw_new_confirm : '';

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

  public managePassword(): void {
    if(this.pw_old && this.pw_new && this.pw_new_confirm){
      console.log("[PassMan]: Fields not empty");
      if(this.pw_new === this.pw_new_confirm && this.pw_old !== this.pw_new){
        console.log("[PassMan]: Old Password differs from new one. Success!");
        const setPasswordSub: Subscription = this._api.setPassword(this.pw_old, this.pw_new).subscribe(
          (success: boolean) => {
            setPasswordSub.unsubscribe();
            if(success) {
              console.log("[PassMan]: Password changed successfully");
              this.goToLogIn({});
            } else {
              console.log("[PassMan]: Password change FAILED!");
            }
          }
        );
      } else {
        console.log("[PassMan]: Old and new Password same");
      }
    } else {
      console.log("[PassMan]: All fields have to be filled");
    }
  }
}
