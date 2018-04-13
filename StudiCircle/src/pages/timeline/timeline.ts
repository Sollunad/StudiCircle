import {Component} from "@angular/core";
import {PopoverController, NavParams} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {Appointment} from "../../providers/declarations/Appointment";
import * as moment from 'moment';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})

export class TimelinePage {

  circleId:number;
  userRole:string= 'admin';

  appointments: AppointmentCard[] = [
    {appointment: {id: 1, title: 'Basketball', description: 'Tolles Event', location: 'Mannheim', startDate: '2018-04-13T18:40:37.049Z',
    endDate: '2018-04-14T18:40:37.049Z' ,countCommits: 12,countRejections: 2, countInterested: 7},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'}];

  constructor(private popoverCtrl: PopoverController,circleProvider:CircleProvider, navParams:NavParams) {
    this.circleId = navParams.get('circleId');
    console.log(moment().toISOString());

    /*circleProvider.getUserRole(this.circleId).subscribe(data => {
     this.userRole = data.role;
     });*/
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

export interface AppointmentCard{
  appointment:Appointment
  vote:string;
}
