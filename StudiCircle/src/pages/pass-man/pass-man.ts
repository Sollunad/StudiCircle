import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {ApiProvider} from "../../providers/api/api";
import {Subscription} from "rxjs/Subscription";
import {ToastyProvider} from "../../providers/toasty/toasty";

@Component({
  selector: 'page-pass-man',
  templateUrl: 'pass-man.html'
})
export class PassManPage {

  pw_old : string = '';
  pw_new : string =  '';
  pw_new_confirm : string = '';

  constructor(public navCtrl: NavController,
              private _api: ApiProvider,
              private toasty : ToastyProvider) {
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
      if(this.pw_new === this.pw_new_confirm){
        if(this.pw_old !== this.pw_new){
          const setPasswordSub: Subscription = this._api.setPassword(this.pw_old, this.pw_new).subscribe(
            (success: boolean) => {
              setPasswordSub.unsubscribe();
              if(success) {
                console.log("[PassMan]: Password changed successfully");
                this.toasty.toast("Password changed successfully");
                this.goToLogIn({});
              } else {
                console.log("[PassMan]: Password change FAILED!");
                this.toasty.toast("Password change failed");
              }
            }
          );
        } else {
          console.log("[PassMan]: Old and new Password same");
          this.toasty.toast("Old and new Password same");
        }
      } else {
        console.log("[PassMan]: Password confirmation failed");
        this.toasty.toast("Password confirmation failed");
      }
    } else {
      console.log("[PassMan]: All fields have to be filled");
      this.toasty.toast("All fields have to be filled");
    }
  }
}
