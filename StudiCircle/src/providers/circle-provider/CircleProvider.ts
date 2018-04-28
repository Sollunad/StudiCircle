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
import {BlackboardPost} from "../declarations/BlackboardPost";
import {Invitation} from "../declarations/Invitation";
import {InvitationStatus} from "../declarations/InvitationStatus";

@Injectable()
export class CircleProvider {

  constructor(public http: HttpClient, public apiProvider: ApiProvider, public consts: constants) {
  }

  public getCircles(): Observable<Circle[]> {
    return this.http.get<Circle[]>(this.consts.url+'circle/forUser?mySession=' + this.apiProvider.currentUser.session);
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
    const createCircle: Subscription = this.http.post(
      this.consts.url+'circle/new', body, header).subscribe(
      (res: ApiResponse) => {
        createCircle.unsubscribe();
        resSubject.next(res.httpStatus = 200);
      },
      (error: any) => {
        createCircle.unsubscribe();
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
      this.consts.url+'circle/edit', body, header).subscribe(
      (res: ApiResponse) => {
        editVisibility.unsubscribe();
        resSubject.next(res.httpStatus = 200);
      },
      (error: any) => {
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
    const url = this.consts.url+`circle/forLocation?lat=${lat}&lon=${lon}&dist=${distance}&mySession=${this.apiProvider.currentUser.session}`;
    return this.http.get<Circle[]>(url);
  }

  public getCircleVisibility(cid: number): Observable<boolean>{
    return this.http.get<boolean>(this.consts.url+'circle/getVisibility?circleId='+cid+'&mySession=' + this.apiProvider.currentUser.session);
  }

  public addUserToCircle(circleId: number) {
    return this.http.post(this.consts.url+'circle/addUser', {
      userId: this.apiProvider.currentUser.uuid,
      circleId: circleId,
      mySession: this.apiProvider.currentUser.session
    });
  }

  public selectNewAdmin(userId: number, circleId: number){
    const resSubject: Subject<any> = new Subject<any>();
    let body = {"userId": userId, "circleId": circleId, mySession : this.apiProvider.currentUser.session};
    let header = {"headers": {"Content-Type": "application/json"}};
    const selectNewAdmin: Subscription = this.http.post(this.consts.url + 'circle/newAdmin', body, header).subscribe(
      (res: ApiResponse) => {
        selectNewAdmin.unsubscribe();
        resSubject.next(res.httpStatus = 200);
      },
      (error: any) => {
        selectNewAdmin.unsubscribe();
        resSubject.next(error);
      }
    );
    return resSubject.asObservable();
  }

  public leaveCircle(circleId: number){
    let body = {"circleId": circleId, mySession : this.apiProvider.currentUser.session};
    return this.http.post(this.consts.url+'circle/leave',body);
  }

  public changeRole(userId: number, circleId: number, role: string) {
    return this.http.post(this.consts.url+'circle/changerole', {
      userId: userId,
      circleId: circleId,
      role: role,
      mySession : this.apiProvider.currentUser.session
    })
  }

  public editModules(cid: number, calendar: boolean, bill: boolean, bet: boolean, file: boolean, market:boolean){
    const resSubject: Subject<any> = new Subject<any>();
    let data = {id : cid, calendar : calendar, bill: bill, bet: bet, file: file, market: market, mySession : this.apiProvider.currentUser.session};
    let header = {"headers" : {"Content-Type": "application/json"}};
    const editModules: Subscription = this.http.post(
      this.consts.url+'circle/editModules',data, header).subscribe(
      (res: ApiResponse) => {
        editModules.unsubscribe();
        resSubject.next(res.httpStatus = 200);
      },
      (error: any) => {
        editModules.unsubscribe();
        resSubject.next(error);
      }
    );
    return resSubject.asObservable();
  }

  public invite(id : number, mail: string) {
    const resSubject: Subject<any> = new Subject<any>();
    let body = {circleId: id, mail: mail, mySession: this.apiProvider.currentUser.session};
    let header = {"headers": {"Content-Type": "application/json"}};
    const inviteToCircle: Subscription = this.http.post(
      this.consts.url + 'circle/invite', body, header).subscribe(
      (res: ApiResponse) => {
        inviteToCircle.unsubscribe();
        resSubject.next(res.httpStatus = 200);
      },
      (error: any) => {
        inviteToCircle.unsubscribe();
        resSubject.next(error);
      }
    );
    return resSubject.asObservable();
  }

  public answerInvite(cId : number, iId: number, status: boolean) {
    const resSubject: Subject<any> = new Subject<any>();
    let body = {circleId: cId, invitId: iId, status: status, mySession: this.apiProvider.currentUser.session};

    let header = {"headers": {"Content-Type": "application/json"}};
    const answerInvite: Subscription = this.http.post(
      this.consts.url + 'circle/answerInvit', body, header).subscribe(
      (res: ApiResponse) => {
        answerInvite.unsubscribe();
        resSubject.next(res.httpStatus = 200);
      },
      (error: any) => {
        answerInvite.unsubscribe();
        resSubject.next(error);
      }
    );
    return resSubject.asObservable();
  }

  public getAllInvitsForUser(): Observable<Invitation[]>{
    return this.http.get<Invitation[]>(this.consts.url+'circle/getInvitForUser?mySession=' + this.apiProvider.currentUser.session);
  }

  public getAllInvitsForCircle(cId: number): Observable<InvitationStatus[]> {
    return this.http.get<InvitationStatus[]>(this.consts.url + 'circle/getInvitForCircle?circleId='+cId+'&mySession=' + this.apiProvider.currentUser.session);
  }

  public getBlackboardPosts(circleId: number): Observable<BlackboardPost[]>{
    console.log('getBlackboardPosts', circleId);

    const url = this.consts.url+`blackboard/posts?circleId=${circleId}&mySession=${this.apiProvider.currentUser.session}`;
    return this.http.get<BlackboardPost[]>(url);
  }

  public insertPost(circleId: number, title: string, text: string): Observable<BlackboardPost> {
    console.log('insertPost', circleId, title, text);

    const url = this.consts.url+`blackboard/newPost`;
    return this.http.post(url, {
      circleId: circleId,
      userId: this.apiProvider.currentUser.id,
      title: title,
      text: text,
      mySession: this.apiProvider.currentUser.session
    });
  }

  public deletePost(post: BlackboardPost){
    console.log('deletePost', post.id);

    return this.http.post(this.consts.url +'blackboard/deletePost/', {
      postID: post.id,
      mySession: this.apiProvider.currentUser.session
    });
  }
}
