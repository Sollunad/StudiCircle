/**
 * Created by MartinThissen on 26.03.2018.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class CircleProvider {

  public memberList: Array<string> = [];

  constructor(public http: HttpClient) {
  }

  private mapMemberJsonToStringArray(data) {
    for(let i=0; i < data.length; i++){
      this.memberList.push(data[i].name);
    }
  }

  public getMemberListByCircleId(uid: number): Array<string>{
    this.http.get(`http://localhost:8080/circle/members?id=${uid}`).subscribe((memberList) => {
      this.mapMemberJsonToStringArray(memberList);
    });
    return this.memberList;
  }

}

