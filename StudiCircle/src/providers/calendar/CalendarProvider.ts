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
import {UserVote} from "../declarations/UserVote";
import * as isSameDay from 'date-fns/is_same_day';
import {DayConfig, CalendarComponentOptions} from "ion2-calendar";


@Injectable()
export class CalendarProvider {

  private _apiPath = this.consts.url;

  public appointmentList:Observable<Appointment[]>;

  public filteredDate:Date;

  public filteredAppointments:Appointment[]=[];

  public appointments: Appointment[] = [];

  options:CalendarComponentOptions;
  dates:Array<DayConfig>=[];

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

  public test(cirleId:number){
    console.log(this.filteredDate);
    this.getAllCalendarEntries(cirleId).subscribe(data => {
      this.appointments = data;
      this.options = {};
      this.dates = this.fillUpCalendar(this.appointments);
      this.options.daysConfig = this.dates;
      this.options.from = new Date('2010-01-01T00:00:00.000Z');
      this.options.to = 0;
      console.log(this.filteredDate);
      this.filterDate();
    });
  }

  filterDate(){
    console.log(this.filteredDate);
    if(this.filteredDate!=null){
      this.filteredAppointments = this.appointments.filter(
        appointment => isSameDay(this.filteredDate,new Date(appointment.startDate))
      );
    } else{
      this.filteredAppointments = this.appointments;
    }
  }

  fillUpCalendar(appointmentList:Appointment[]):Array<DayConfig>{
    let dateList:Array<DayConfig> = [];
    appointmentList.forEach(appointment => {
      dateList.push({date:new Date(appointment.startDate),subTitle:'●'});
    });
    return dateList;
  }

  public getVoteList(appointmentId: number): Observable<UserVote[]>{
    return this.http.get<UserVote[]>(this.consts.url + 'calendar/votingDetails?appointmentId='+appointmentId+'&mySession='+this.apiProvider.currentUser.session);
  }
}
