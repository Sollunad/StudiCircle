import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PassManPage} from '../pass-man/pass-man';
import {LogInPage} from '../log-in/log-in';
import {GetInvolvedPage} from '../get-involved/get-involved';
import {VerifyNowPage} from '../verify-now/verify-now';
import {DashboardPage} from '../dashboard/dashboard';
import {ChangeMailPage} from '../change-mail/change-mail';
import {ApiProvider} from "../../providers/api/api";
import {Subscription} from "rxjs/Subscription";
import {ToastyProvider} from "../../providers/toasty/toasty";
import {FAQPage} from "../faq/faq";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public pw_confirm: string;
  public deleteButtonColor: string;
  public enabled: boolean;
  private accountName : string;

  constructor(public navCtrl: NavController,
              private _api: ApiProvider,
              private alertCtrl : AlertController,
              private toasty : ToastyProvider) {
    this.deleteButtonColor = "greyedout";
    this.enabled = false;
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
  }goToFAQ(params): void{
    if (!params) params = {};
    this.navCtrl.push(FAQPage);
  }

  public validateInput(input: string): void{
    if(this.pw_confirm.length >= 8){
      this.changeDeleteButton(true);
    }else{
      this.changeDeleteButton(false);
    }
  }

  public changeDeleteButton(activate: boolean): void{
    this.enabled = activate;
    this.deleteButtonColor = this.enabled? "danger":"greyedout";
  }

  public deleteAccount(): void {
    let confirmation : boolean;
    let alert = this.alertCtrl.create({
      title: 'Confirm Deletion',
      subTitle: 'Are you sure you want to delete the Account?',
      buttons: [
        {
          text : 'Ah Nevermind',
          role : 'cancel',
          handler : () => {
            console.log("[DELETEACC] : Account deletion aborted");
          }
        },
        {
          text:'Go Ahead',
          handler : () => {
            const deleteAccountSub: Subscription = this._api.deleteUser(this.pw_confirm).subscribe(
              (status: number) => {
                deleteAccountSub.unsubscribe();
                if(status===200) {
                  console.log("[SETTINGS] : Account deletion successful");
                  this.toasty.toast("Account deletion successful");
                  this.goToLogIn({});
                  return;
                } else if(status===412){
                  this.toasty.toast("User still Admin in one or more circles")
                  return;
                } else if(status===400) {
                  console.log("[SETTINGS] : Session or Password missing");
                  return;
                } else if(status===401) {
                  console.log("[SETTINGS] : Session or Password invalid");
                  this.toasty.toast("Wrong Password");
                  return;
                }
                this.toasty.toast("Account deletion failed");
              }
            );
            return true;
          }
        }
        ]
    });

    alert.present();
  }

}
