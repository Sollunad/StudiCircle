import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserInfo} from '../../providers/declarations/UserInfo';
import {Subscription} from "rxjs/Subscription";
import {map} from "rxjs/operators/map";
import {Subject} from "rxjs/Subject";
import {ApiResponse} from "../declarations/ApiResponse";
import {AccountTypes} from "../declarations/AccountTypeEnum";
import {LoginResponse} from "../declarations/LoginResponse";
import {constants} from "../../consts/constants";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private _apiPath = this.consts.url;
  public currentUser: UserInfo;

  constructor(private http: HttpClient, private consts : constants) {

  }

  public getCurrentUser():UserInfo{
    return this.currentUser;
  }

  public changeMail(new_mail : string, pwd : string){
    let data = {
      "mySession" : this.currentUser.session,
      "oldMail" : this.currentUser.mail,
      "newMail" : new_mail,
      "pwd" : pwd
    };
    console.log(data);
    let header = { "headers": {"Content-Type": "application/json"} };
    return this.http.post(
      this._apiPath + "user/updateMail",
      data,
      header
    ).pipe(
      map(
        (res: ApiResponse) => {
          if (res.httpStatus === 200) {
            this.currentUser.mail = new_mail;
          }
          return res.httpStatus;
        }
      )
    );
  }

  public login(username: string, password: string): Observable<number>{
    let userCredentials = {"mail": username, "pwd": password};
    const header = { "headers": {"Content-Type": "application/json"} };
    return this.http.post(
      this._apiPath + "user/login",
      userCredentials,
      header
    ).pipe(
      map(
        (res: LoginResponse) => {
          if(res.httpStatus === 200) {
            this.currentUser = res.userData;
            this.currentUser.session = res.session;
          }
          return res.httpStatus;
        }
      )
    );
  }

  public register(mail : string, name : string, passwd : string, type : string){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    let typeAsInt : number;
    if(type == 'student'){
      typeAsInt = AccountTypes.STUDENT;
    }else{
      if(type == 'business'){
        typeAsInt = AccountTypes.BUSINESS;
      }else{
        typeAsInt = AccountTypes.STUDENT;
      }
    }

    const data = JSON.stringify({
      "mail": mail,
      "username" : name,
      "pwd": passwd,
      "type": typeAsInt
    });

    const header = { "headers": {"Content-Type": "application/json"} };

    const registerNewUser: Subscription = this.http.post(
      this._apiPath + "user/register",
      data,
      header
    ).subscribe(
      (res: ApiResponse) => {
        registerNewUser.unsubscribe();
        successSubject.next(res.httpStatus === 200);
      },
      (error: any) => {
        console.log(error);
        registerNewUser.unsubscribe();
        successSubject.next(false);
      }
    );
    return successSubject.asObservable();
  }

  public forgotPassword(mail: string): Observable<boolean> {
    const successSubject: Subject<boolean> = new Subject<boolean>();
    const requestSub: Subscription = this.http.post(
      this._apiPath + "user/forgotPassword",
      {
        "mail": mail
      }
    ).subscribe(
      (res: ApiResponse) => {
        successSubject.next(res.httpStatus === 200);
        requestSub.unsubscribe();
      },
          () => {
        successSubject.next(false);
        requestSub.unsubscribe();
      }
    );

    return successSubject.asObservable();
  }

  public deleteUser(password: string): Observable<number> {
    const successSubject: Subject<number> = new Subject<number>();
    const requestSub: Subscription = this.http.post(
      this._apiPath + "user/deleteUser",
      {
        mySession : this.currentUser.session,
        pwd: password
      }
    ).subscribe(
      (res: ApiResponse) => {
        successSubject.next(res.httpStatus);
        requestSub.unsubscribe();
      },
      () => {
        successSubject.next(undefined);
        requestSub.unsubscribe();
      }
    );

    return successSubject.asObservable();
  }

  public setPassword(oldPwd: string, newPwd: string): Observable<boolean> {
    const successSubject: Subject<boolean> = new Subject<boolean>();
    const requestSub: Subscription = this.http.post(
      this._apiPath + "user/setPassword",
      {
        mySession : this.currentUser.session,
        oldPwd: oldPwd,
        newPwd: newPwd
      }
    ).subscribe(
      (res: ApiResponse) => {
        successSubject.next(res.httpStatus === 200);
        requestSub.unsubscribe();
      },
      (res : HttpErrorResponse) => {
        successSubject.next(false);
        requestSub.unsubscribe();
      }
    );
    return successSubject.asObservable();
  }

  public setLocation(lat, lon) {
    this.currentUser.coords = {lat: lat, lon: lon};
    console.log('storedLocation:', this.currentUser);
  }
}
