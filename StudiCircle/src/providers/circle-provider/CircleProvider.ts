/**
 * Created by MartinThissen on 26.03.2018.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserInfo} from "../declarations/UserInfo";
import {ApiResponse} from "../declarations/ApiResponse";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";


@Injectable()
export class CircleProvider {

  public memberList: Array<string> = [];

  constructor(public http: HttpClient) {
  }

  public getMemberListByCircleId(uid: number): Observable<UserInfo[]>{
    return this.http.get<UserInfo[]>(`http://localhost:8080/circle/members?id=uid`);
  }

  public getModuleListByCircleId(uid:number): Observable<String[]>{
    return this.http.get<String[]>(`http://localhost:8080/circle/modules?circleId=uid`);
  }

  private _path = "http://localhost:8080/";
  public edit(id : string, visibility : string){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    const editVisibility: Subscription = this.http.post(
      this._path + "circle/edit",
      {
        params: {
          id : id,
          vis : visibility
        }
      }
    ).subscribe(
      (res: ApiResponse) => {
        editVisibility.unsubscribe();
        successSubject.next(res.httpStatus === 200);
      },
      (error: any) => {
        console.log(error);
        editVisibility.unsubscribe();
        successSubject.next(false);
      }
    );
  }

  public removeCircleByCircleId(uid: number): Observable<any>{
    console.log(uid);
    let body = {"id": uid};
    return this.http.post(`http://localhost:8080/circle/remove`,body);
  }
}


