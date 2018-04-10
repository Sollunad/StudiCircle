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

  public create(name : string, visibility : string, location: any){
    const successSubject: Subject<boolean> = new Subject<boolean>();
    let body = {name : name, vis : visibility, loc : location, mySession : this.apiProvider.currentUser.session};
    let header = {"headers" : {"Content-Type": "application/json"}};
    const editVisibility: Subscription = this.http.post(
      this.consts.url+'circle/new', body, header
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
    let body = {id : id, vis : visibility, mySession : this.apiProvider.currentUser.session};
    console.log(body);
    let header = {"headers" : {"Content-Type": "application/json"}};
    const editVisibility: Subscription = this.http.post(
      this.consts.url+'circle/edit', body, header
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

  public addUserToCircle(circleId: number) {
    return this.http.post(this.consts.url+'circle/addUser', {
      userId: this.apiProvider.currentUser.uuid,
      circleId: circleId
    });
  }

  public getBlackboardPosts(circleId: number): Observable<BlackboardPost[]>{
    // console.log('getBlackboardPosts', circleId);

    // const url = this.consts.url+`circle/blackboard/posts/${circleId}`;
    const url = `http://localhost:8080/circle/blackboard/posts?id=${circleId}`;
    return this.http.get<BlackboardPost[]>(url);
  }

  public insertPost(circleId: number, title: string, text: string): Observable<BlackboardPost> {
    console.log('insertPost', circleId, title, text);

    // const url = this.consts.url+`circle/blackboard/posts/newPost`;
    const url = 'http://localhost:8080/circle/blackboard/newPost';
    return this.http.post<BlackboardPost>(url, {
      circleId: circleId,
      userId: this.apiProvider.currentUser.uuid,
      title: title,
      text: text
    });
  }

  public deletePost(postID: number){
    //const url = this.const.url+"circle/blackboard/deletePost"+postID;
    //return this.http.post(url, {postID: postID});
    return 1;
  }

}
