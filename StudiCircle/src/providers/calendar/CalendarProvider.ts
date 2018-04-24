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
import {Vote} from "../declarations/Vote";


@Injectable()
export class CalendarProvider {

  private _apiPath = this.consts.url;

  public appointmentList:Observable<Appointment[]>;

  constructor(public http: HttpClient, public apiProvider: ApiProvider, public consts: constants) {
  }

  public addCalendarEntry(circleId:number, appointment:Appointment): Observable<any>{

    let body = {circleId: circleId, mySession : this.apiProvider.currentUser.session, appointment:appointment};
    return this.http.post(this.consts.url+'calendar/create',body);
  }

  public editCalendarEntry(circleId:number, appointment:Appointment): Observable<any>{
    console.log(appointment.id);
    let body = {appointmentId: appointment.id, mySession : this.apiProvider.currentUser.session, appointment:appointment};
    return this.http.post(this.consts.url+'calendar/edit',body);
  }

  public deleteCalendarEntry(appointmentId:number): Observable<any>{
    let body = {appointmentId: appointmentId, mySession : this.apiProvider.currentUser.session};
    return this.http.post(this.consts.url+'calendar/delete',body);
  }

  public voteForAppointment(appointmentId: number, vote:Vote){
    let body = {appointmentId: appointmentId, mySession : this.apiProvider.currentUser.session, voting: vote};
    return this.http.post(this.consts.url+'calendar/vote',body);
  }

  public getAllCalendarEntries(circleId:number): Observable<Appointment[]>{
    return this.http.get<Appointment[]>(this.consts.url+'calendar/getAllAppointments?circleID='+circleId+'&mySession='+this.apiProvider.currentUser.session);
  }
}
