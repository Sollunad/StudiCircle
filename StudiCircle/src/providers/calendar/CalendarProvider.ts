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
import {Appointment} from "../declarations/Appointment";


@Injectable()
export class CalendarProvider {

  private _apiPath = this.consts.url;

  constructor(public http: HttpClient, public apiProvider: ApiProvider, public consts: constants) {
  }

  public addCalendarEntry(circleId:number, appointment:Appointment): Observable<any>{

    let body = {circleId: circleId, mySession : this.apiProvider.currentUser.session, appointment:appointment};
    return this.http.post(this.consts.url+'calendar/create',body);
  }

  public editCalendarEntry(circleId:number, appointment:Appointment): Observable<any>{
    let body = {circleId: circleId, mySession : this.apiProvider.currentUser.session, appointment:appointment};
    return this.http.post(this.consts.url+'calendar/edit',body);
  }

  public deleteCalendarEntry(circleId:number, appointmentId:number): Observable<any>{
    let body = {circleId: circleId, mySession : this.apiProvider.currentUser.session, appointmentId:appointmentId};
    return this.http.post(this.consts.url+'calendar/delete',body);
  }

  public getAllCalendarEntries(circleId:number): Observable<Appointment[]>{
    return this.http.get<Appointment[]>(this.consts.url+'calendar/getAllAppointments?circleID='+circleId);
  }
}
