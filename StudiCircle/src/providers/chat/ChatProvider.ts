/**
 * Created by MartinThissen on 26.03.2018.
 */

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ApiProvider} from "../api/api";
import {constants} from "../../consts/constants";
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;


@Injectable()
export class ChatProvider {

  private _apiPath = this.consts.url;

  constructor(public http: HttpClient, public apiProvider: ApiProvider, public consts: constants) {
  }

  public openSocketConnection(circleId : number):Socket{
    console.log("[OPENSOCKETCONNECTION]");
    return io(
      this._apiPath,
      {
        query: {
          sessionId:  this.apiProvider.currentUser.session,
          circleId:   circleId
        },
        path: '/socket/socket.io'
        //transports: ['websocket']
      }
    );
  }

  public loadMessagesFromTo(circleId:number, offset:number, limit:number): Observable<any>{
    return this.http.get<any>(this.consts.url+'chat/getMessages?circleId=' + circleId + '&mySession=' +
      this.apiProvider.currentUser.session + '&offset=' + offset + '&limit=' + limit);
  }
}
