/**
 * Created by MartinThissen on 26.03.2018.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserInfo} from "../declarations/UserInfo";
import {Circle} from "../declarations/Circle";
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

  public getModuleListByCircleId(uid:number): Observable<any>{
    return this.http.get<any>('http://localhost:8080/circle/modules?circleId='+uid);
  }

  public create(name : string, visibility : string){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    let body = {name : name, vis : visibility};
    let header = {"headers" : {"Content-Type": "application/json"}}
    const editVisibility: Subscription = this.http.post(
      "http://localhost:8080/circle/new", body, header
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
    return successSubject.asObservable();
  }

  public edit(id : number, visibility : string){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    let body = {id : id, vis : visibility};
    let header = {"headers" : {"Content-Type": "application/json"}}
    const editVisibility: Subscription = this.http.post(
      "http://localhost:8080/circle/edit", body, header
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
    return successSubject.asObservable();
  }

  public removeCircleByCircleId(CircleId: number): Observable<any>{
    let body = {"id": CircleId};
    return this.http.post(`http://localhost:8080/circle/remove`,body);
  }

  public removeCircleMember(userId: number, circleId: number): Observable<any>{
    let body = {"userId": userId, "circleId": circleId};
    return this.http.post(`http://localhost:8080/circle/removeUser`,body);
  }
}
