import { AccountTypes } from './../../providers/declarations/AccountTypeEnum';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {VerifyNowPage} from '../verify-now/verify-now';
import {LogInPage} from '../log-in/log-in';
import {DashboardPage} from '../dashboard/dashboard';
import {ApiProvider} from "../../providers/api/api";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {getMailRegex, stringHasAppropiateLength} from "../../util/stringUtils";
import {ToastyProvider} from "../../providers/toasty/toasty";

@Component({
  selector: 'page-get-involved',
  templateUrl: 'get-involved.html'
})
export class GetInvolvedPage {

  user : UserInfo;

  profile = {
    mail : '',
    name : '',
    password : '',
    profileType : ''
  };

  public mailValidation = getMailRegex();

  public business_desc = "";
  passwdChk = '';
  accountType: string = "student";
  selectedAccountType: AccountTypes;

  constructor(public navCtrl: NavController, private _apiService : ApiProvider, private toasty : ToastyProvider) {
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

  registerNow(){
    const registration = this._apiService.register(this.profile.mail,
                                                   this.profile.name,
                                                   this.profile.password,
                                                   this.profile.profileType,
                                                    this.business_desc).subscribe(
      (success: boolean) => {
        if(success){
          console.log("[REGISTER] : Registration successful");
          this.toasty.toast("Registration successful");
          this.goToVerifyNow({});
        }else{
          console.log("[REGISTER] : Registration not successful");
          this.toasty.toast("Registration was not successful");
        }
        registration.unsubscribe();
        return success;
      }
    )
  }

  usernameCheck(){
    if(this.profile.name){
      if(this.profile.name.match('([a-zA-ZäöüÄÖÜ\\-]+ (([a-zA-ZäöüÄÖÜ]+\\-{0,1}[a-zA-ZäöüÄÖÜ]+)+))$')){
        console.log("[REGISTER] : User Name is valid");
        return true;
      }else{
        this.toasty.toast("Invalid Username");
        console.log("[REGISTER] : Set User - Name not valid");
      }
    }
    return false;
  }

  passwdCheck(){
    if(stringHasAppropiateLength(this.profile.password,8,64)){
      console.log("[REGISTER] : Password complies to policy");
      if((this.profile.password === this.passwdChk)){
        console.log("[REGISTER] : PasswordCheck successful");
        return true;
      }else{
        this.toasty.toast("Passwords are not equal");
        console.log("[REGISTER] : PasswordCheck not successful");
      }
      return false;
    }else{
      this.toasty.toast("Password must contain Letters & Numbers & a special character at a miminum length of eight characters");
      console.log("[REGISTER] : Password must contain Letters & Numbers & a special character at a miminum length of eight characters");
    }
    this.profile.password = '';
    this.passwdChk = '';
    return false;
  }

  logProfile(){
    if(this.accountType == undefined){
      this.toasty.toast("No account Type selected");
      return;
    }
    this.selectedAccountType = this.accountType === "student"? AccountTypes.STUDENT : AccountTypes.BUSINESS;
    if(this.profile.mail && this.profile.password && this.passwdChk){
      if(this.selectedAccountType === AccountTypes.STUDENT){
        console.log("[REGISTER] : Student Profile");
        if(this.profile.mail.match('(@student\.)|(\.edu$)') && this.profile.mail.match(getMailRegex())){
          console.log("[REGISTER] : Valid Student Mail");
          if(this.passwdCheck()){
            this.profile.profileType = 'student';
            if(this.usernameCheck()){
              this.registerNow();
            }
          }
        }else{
          console.log("[REGISTER] : Invalid Student Mail | only supports domains of educational authorities");
          this.toasty.toast("Invalid Student Mail | only supports domains of educational authorities");
        }
      }else{
        if(this.selectedAccountType === AccountTypes.BUSINESS){
          console.log("[REGISTER] : Business User detected");
          if(this.profile.mail.match(getMailRegex())){
            if(this.passwdCheck()){
              this.profile.profileType = 'business';
              if(this.usernameCheck()){
                this.registerNow();
              }
            }
          }
        }else{
          console.log("[REGISTER] : Please select a Type of User");
          this.toasty.toast("Please select a Type of User");
        }
      }
    }else{
      if(!this.profile.name){
        console.log("[REGISTER] : User Name is a required field");
        this.toasty.toast("User Name is a required field");
      }
      if(!this.profile.mail){
        console.log("[REGISTER] : Mail is a required field");
        this.toasty.toast("Mail is a required field");
      }
      if(!this.profile.password){
        console.log("[REGISTER] : Password is a required field");
        this.toasty.toast("Password is a required field");
      }
      if(!this.passwdChk){
        console.log("[REGISTER] : Please confirm your password of choice");
        this.toasty.toast("Password is a required field");
      }
    }
  }

}
