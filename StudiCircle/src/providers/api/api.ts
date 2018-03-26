import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../../providers/declarations/UserInfo';
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import {ApiResponse} from "../declarations/ApiResponse";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private _apiPath = "https://api.sknx.de/";
  public currentUser: UserInfo;

  constructor(public http: HttpClient) {

  }

  public login(username: string, password: string): Observable<any>{
    return new Observable<any>();
  }

  public register(user : UserInfo, passwd : string, type : string){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    const registerNewUser: Subscription = this.http.post(
      this._apiPath + "user/register",
      {
        params: {
          mail : user.username,
          pwd : passwd,
          type : type
        }
      }
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

}
