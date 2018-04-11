import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import {PassManPage} from '../pass-man/pass-man';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
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

  mailChange(){
    if(this.oldMail && this.newMail && this.chkNewMail && this.pwd){
      if(this.oldMail != this.newMail){
        if(this.newMail == this.chkNewMail) {
          const requestMailChange: Subscription = this._api.changeMail( this.newMail , this.pwd).subscribe(
            (data: boolean) => {
              if (data) {
                console.log("[MAIL CHANGE] : Mail Change was successful");
                requestMailChange.unsubscribe();
                this.goToSettings({});
              } else {
                console.log("[MAIL CHANGE] : Mail Change not successful");
                requestMailChange.unsubscribe();
              }
            }
          );
        }else{
          console.log("[MAIL CHANGE] : Supplied new Mail differs from confirmation Mail");
        }
      }else{
        console.log("[MAIL CHANGE] : Old Mail and new Mail must be different");
      }
    }else{
      if(!this.oldMail){
        console.log("[MAIL CHANGE] : Old Mail is required");
      }
      if(!this.newMail){
        console.log("[MAIL CHANGE] : New Mail is required");
      }
      if(!this.chkNewMail){
        console.log("[MAIL CHANGE] : Confirmation of new Mail is required");
      }
      if(!this.pwd){
        console.log("[MAIL CHANGE] : Password is required");
      }
    }
  }
}
