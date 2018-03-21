import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VerifyNowPage } from '../verify-now/verify-now';
import { LogInPage } from '../log-in/log-in';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-get-involved',
  templateUrl: 'get-involved.html'
})
export class GetInvolvedPage {

  mail : any;
  password : any;
  passwdChk : any;

  constructor(public navCtrl: NavController) {
    this.mail = '';
  }

  goToVerifyNow(params){
    this.verifyStudentMail();
    if (!params) params = {};
    this.navCtrl.push(VerifyNowPage);
  }

  goToLogIn(params){
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }

  goToGetInvolved(params){
    if (!params) params = {};
    this.navCtrl.push(GetInvolvedPage);
  }

  goToDashboard(params){
    if (!params) params = {};
    this.navCtrl.push(DashboardPage);
  }

  verifyStudentMail(){
    //TODO add cond for when profile type is business profile
    if(!(this.mail.includes("@student") || this.mail.includes(".edu"))){
      if(this.mail.length>0){
        console.log("[get-involved] Not valid student mail address: " + this.mail)
      }else{
        console.log("[get-involved] No String collected.")
      }
    }else{
      console.log("[get-involved] Hooray! Valid Student Address: " + this.mail);
      if(this.password === this.passwdChk && this.password.length > 0){
        console.log("[get-involved] Hooray passwords are equal!")
        this.goToVerifyNow({});
      }else{
        console.log("[get-involved] Nay passwords are not equal!")
      }
    }
  }
}
