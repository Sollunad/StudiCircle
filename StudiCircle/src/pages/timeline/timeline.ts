import {Component, Input} from "@angular/core";
import {PopoverController, NavParams} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {Appointment} from "../../providers/declarations/Appointment";
import * as isSameDay from 'date-fns/is_same_day';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html',
})

export class Timeline {

  circleId:number;

  @Input()
  userRole:string;

  filteredDate:Date;

  filteredAppointments:AppointmentCard[]=[];

  appointments: AppointmentCard[] = [
    {appointment: {id: 1, title: 'Basketball', description: 'Tolles Event', location: 'Mannheim', startDate: '2018-04-13T18:40:37.049Z',
    endDate: '2018-04-14T18:40:37.049Z' ,countCommits: 12,countRejections: 2, countInterested: 7},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-15T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-18T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 1, title: 'Basketball', description: 'Tolles Event', location: 'Mannheim', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T18:40:37.049Z' ,countCommits: 12,countRejections: 2, countInterested: 7},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-15T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-19T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'}];

  constructor(private popoverCtrl: PopoverController,circleProvider:CircleProvider, navParams:NavParams) {
    this.circleId = navParams.get('circleId');
    this.filteredAppointments = this.appointments;
  }

  @Input()
  set date(date:Date) {
    this.filteredAppointments = this.appointments.filter(
      appointment => isSameDay(date,new Date(appointment.appointment.endDate))
    );
    this.filteredDate = date;
  }

  toggleVote(appointmentCard:AppointmentCard, vote:string) {
     if(appointmentCard.vote===vote) {
       appointmentCard.vote='none';
     }else{
       appointmentCard.vote=vote;
     }
  }

  presentPopover(event) {

    let popover = this.popoverCtrl.create(PopoverTimelinePage);

    popover.present({
      ev: event
    });
  }
}

@Component({
  selector: 'timeline-page',
  templateUrl: 'timeline-page.html',
})

export class TimelinePage {

  userRole:string = 'admin';

  constructor(){
    /*circleProvider.getUserRole(this.circleId).subscribe(data => {
     this.userRole = data.role;
     });*/
  }
}

export interface AppointmentCard{
  appointment:Appointment
  vote:string;
}
