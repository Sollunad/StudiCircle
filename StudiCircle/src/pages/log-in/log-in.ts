import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GetInvolvedPage } from '../get-involved/get-involved';
import { VerifyNowPage } from '../verify-now/verify-now';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  mail : '';
  pw : '';

  constructor(public navCtrl: NavController) {
  }
  goToGetInvolved(params){
    if (!params) params = {};
    this.navCtrl.push(GetInvolvedPage);
  }goToVerifyNow(params){
    if (!params) params = {};
    this.navCtrl.push(VerifyNowPage);
  }goToLogIn(params){
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }goToDashboard(params){
    if (!params) params = {};
    this.navCtrl.push(DashboardPage);
  }

  login(){
    if(this.mail.match('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$') && this.pw.match('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{6,}$')){
      console.log("[LOGIN] : Logging in");
      this.goToDashboard({});
    }else {
      if(!this.mail || !this.pw){
        console.log("[LOGIN] : Please provide an E-Mail as well as an Password");
      }else{
        console.log("[LOGIN] : Non-compliant E-Mail or Password")
      }
    }
  }
}
