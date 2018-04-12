/**
 * Created by MartinThissen on 26.03.2018.
 */

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserInfo} from "../declarations/UserInfo";
import {Circle} from "../declarations/Circle";
import {ApiResponse} from "../declarations/ApiResponse";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import {ApiProvider} from "../api/api";
import {constants} from "../../consts/constants";

@Injectable()
export class CircleProvider {

  constructor(public http: HttpClient, public apiProvider: ApiProvider, public consts: constants) {
  }

  public getMemberListByCircleId(uid: number): Observable<UserInfo[]>{
    return this.http.get<UserInfo[]>(this.consts.url+'circle/members?id='+ uid + '&mySession=' + this.apiProvider.currentUser.session);
  }

  public getModuleListByCircleId(uid:number): Observable<string[]>{
    return this.http.get<string[]>(this.consts.url+'circle/modules?circleId=' + uid + '&mySession=' + this.apiProvider.currentUser.session);
  }

  public getUserRole(circleId:number): Observable<any>{
    return this.http.get<any>(this.consts.url+'circle/getRole?circleId=' + circleId + '&mySession=' + this.apiProvider.currentUser.session);
  }

  public create(name : string, visibility : string, location: any){
    const resSubject: Subject<any> = new Subject<any>();
    let body = {name : name, vis : visibility, loc : location, mySession : this.apiProvider.currentUser.session};
    let header = {"headers" : {"Content-Type": "application/json"}};
    const editVisibility: Subscription = this.http.post(
      this.consts.url+'circle/new', body, header
    ).subscribe(
      (res: ApiResponse) => {
        editVisibility.unsubscribe();
        resSubject.next(res);
      },
      (error: any) => {
        console.log(error);
        editVisibility.unsubscribe();
        resSubject.next(error);
      }
    );
    return resSubject.asObservable();
  }

  public edit(id : number, visibility : number){
    const resSubject: Subject<any> = new Subject<any>();
    let body = {id : id, vis : visibility, mySession : this.apiProvider.currentUser.session};
    let header = {"headers" : {"Content-Type": "application/json"}};
    const editVisibility: Subscription = this.http.post(
      this.consts.url+'circle/edit', body, header
    ).subscribe(
      (res: ApiResponse) => {
        editVisibility.unsubscribe();
        resSubject.next(res);
      },
      (error: any) => {
        console.log(error);
        editVisibility.unsubscribe();
        resSubject.next(error);
      }
    );
    return resSubject.asObservable();
  }

  public removeCircleByCircleId(uid: number): Observable<any>{
    console.log(uid);
    let body = {"id": uid, mySession : this.apiProvider.currentUser.session};
    return this.http.post(this.consts.url+'circle/remove',body);
  }

  public removeCircleMember(userId: number, circleId: number): Observable<any>{
    let body = {"userId": userId, "circleId": circleId, mySession : this.apiProvider.currentUser.session};
    return this.http.post(this.consts.url+'circle/removeUser',body);
    }

  public getCirclesByLocation(lat: number, lon: number, distance: number): Observable<Circle[]> {
    // return this.http.get<Circle[]>("http://localhost:8080/circle/circlesForLocation?location[latitude]=lat&location[longitude]=long&location[range]=range");

    const url = this.consts.url+`circle/forLocation?lat=${lat}&lon=${lon}&dist=${distance}`;
    return this.http.get<Circle[]>(url);
  }

  public getCircleVisibility(cid: number): Observable<boolean>{
    return this.http.get<boolean>(this.consts.url+'circle/getVisibility?circleId='+cid+'&mySession=' + this.apiProvider.currentUser.session);
  }

  public addUserToCircle(userId: number, circleId: number) {
    return this.http.post(this.consts.url+'circle/addUser', {
      userId: userId,
      circleId: circleId
    });
  }

  public selectNewAdmin(userId: number, circleId: number){
    let body = {"userId": userId, "circleId": circleId, mySession : this.apiProvider.currentUser.session};
    console.log(body);
    return this.http.post(this.consts.url+'circle/newAdmin',body);
  }

  public leaveCircle(circleId: number){
    let body = {"circleId": circleId, mySession : this.apiProvider.currentUser.session};
    return this.http.post(this.consts.url+'circle/leave',body);
  }

  public checkIfAdmin(cid: number): Observable<any>{
    return this.http.get<any>(this.consts.url+'circle/getRole?circleId='+cid+'&mySession=' + this.apiProvider.currentUser.session);
  }

  public changeRole(userId: number, circleId: number, role: string) {
    return this.http.post(this.consts.url+'circle/changerole', {
      userId: userId,
      circleId: circleId,
      role: role
    })
  }

  public editModules(cid: number, calendar: boolean, bill: boolean, bet: boolean, file: boolean, market:boolean){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    let data = {id : cid, calendar : calendar, bill: bill, bet: bet, file: file, market: market, mySession : this.apiProvider.currentUser.session};
    console.log(data);
    let header = {"headers" : {"Content-Type": "application/json"}};
    const editModules: Subscription = this.http.post(
      this.consts.url+'circle/editModules',data, header
    ).subscribe(
      (res: ApiResponse) => {
        editModules.unsubscribe();
        successSubject.next(res.httpStatus === 200);
      },
      (error: any) => {
        console.log(error);
        editModules.unsubscribe();
        successSubject.next(false);
      }
    );
    return successSubject.asObservable();
  }

}
