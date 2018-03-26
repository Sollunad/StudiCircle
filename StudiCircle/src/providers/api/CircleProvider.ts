/**
 * Created by MartinThissen on 26.03.2018.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class CircleProvider {

  public memberList: Array<string>;

  constructor(public http: HttpClient) {
  }

  /*public getMemberListbyCircleId(uid: number): Array<string>{
    this.http.get('https://someserver.com/api/users').map(res => res.json()).subscribe((memberList) => {
      this.memberList = memberList;
    });
    return this.memberList;
  }*/

}

