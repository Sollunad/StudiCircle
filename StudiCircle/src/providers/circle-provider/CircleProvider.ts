/**
 * Created by MartinThissen on 26.03.2018.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserInfo} from "../declarations/UserInfo";


@Injectable()
export class CircleProvider {

  public memberList: Array<string> = [];

  constructor(public http: HttpClient) {
  }

  public getMemberListByCircleId(uid: number): Observable<UserInfo[]>{
    return this.http.get<UserInfo[]>(`http://localhost:8080/circle/members?id=1`);
  }
  public removeCircleByCircleId(uid: number): Observable<any>{
    console.log(uid);
    let body = {"id": uid};
    return this.http.post(`http://localhost:8080/circle/remove`,body);
  }

}
