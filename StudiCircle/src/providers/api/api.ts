import {HttpClient, HttpHeaders} from '@angular/common/http';
import { UserInfo } from './../declarations/UserInfo';
import { LoginResponse } from './../declarations/LoginResponse';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import {map} from "rxjs/operators/map";
import {Subject} from "rxjs/Subject";
import {ApiResponse} from "../declarations/ApiResponse";
import {AccountTypes} from "../declarations/AccountTypeEnum";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private _apiPath = "https://api.sknx.de/";
  public currentUser: UserInfo;

  constructor(private http: HttpClient) {

  }


  private getSnowflakeHeader(): HttpHeaders {
    return new HttpHeaders(
      {"Content-Type": "application/x-www-form-urlencoded"}
    );
  }

  public login(username: string, password: string): Observable<boolean>{
    let userCredentials = {"mail": username, "pass": password}
    return this.http.get(
      this._apiPath + "user/login",
      {
        params: userCredentials
      }
    ).pipe(
      map(
        (res: LoginResponse) => {
          if(res.status !== 200) {
            return false;
          } else {
            res.userData.session = res.session;
            this.currentUser = res.userData;
            return true;
          }
        }
      )
    );
  }

  public register(mail : string, passwd : string, type : string){
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
    console.log(mail + ' | ' + passwd + ' | ' + type + ' | ' + typeAsInt);
    const registerNewUser: Subscription = this.http.post(
      this._apiPath + "user/register",
      {
        headers: this.getSnowflakeHeader(),
        params: {
          mail : mail,
          pwd : passwd,
          type : typeAsInt
        }
      }
    ).subscribe(
      (res: ApiResponse) => {
        console.log(res);
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
}
