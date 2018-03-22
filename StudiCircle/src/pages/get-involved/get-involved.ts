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

  profile = {
    mail : '',
    password : '',
    profileType : ''
  };

  passwdChk = '';
  business : boolean;
  student : boolean;

  constructor(public navCtrl: NavController) {
  }

  goToVerifyNow(params){
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

  passwdCheck(){
    if(this.profile.password.match('^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$')){
      console.log("[REGISTER] : Password complies to policy");
      if((this.profile.password === this.passwdChk)){
        console.log("[REGISTER] : PasswordCheck successful");
        return true;
      }else{
        console.log("[REGISTER] : PasswordCheck not successful");
      }
      return false;
    }else{
      console.log("[REGISTER] : Password must contain Letters & Numbers & a special character at a miminum length of six characters");
    }
    this.profile.password = '';
    this.passwdChk = '';
    return false;
  }

  logProfile(){
    if(this.profile.mail && this.profile.password && this.passwdChk){
      if(this.student && !this.business){
        console.log("[REGISTER] : Student Profile");
        if(this.profile.mail.match('(@student\.)|(\.edu$)') && this.profile.mail.match('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')){
          console.log("[REGISTER] : Valid Student Mail")
          if(this.passwdCheck()){
            this.profile.profileType = 'student';
            this.goToVerifyNow({});
          }
        }else{
          console.log("[REGISTER] : Invalid Student Mail | only supports domains of educational authorities")
        }
      }else{
        if(this.business && !this.student){
          console.log("[REGISTER] : Business User detected");
          if(this.profile.mail.match('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')){
            if(this.passwdCheck()){
              this.profile.profileType = 'business';
              this.goToVerifyNow({});
            }
          }
        }else{
          console.log("[REGISTER] : Please select a Type of User")
        }
      }
    }else{
      if(!this.profile.mail){
        console.log("[REGISTER] : Mail is a required field")
      }
      if(!this.profile.password){
        console.log("[REGISTER] : Password is a required field")
      }
      if(!this.passwdChk){
        console.log("[REGISTER] : Please confirm your password of choice")
      }
    }
  }

}
