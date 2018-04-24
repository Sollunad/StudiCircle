import {Component, Input} from "@angular/core";
import {PopoverController, NavParams, ModalController} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {Appointment} from "../../providers/declarations/Appointment";
import * as isSameDay from 'date-fns/is_same_day';
import {VoteListPage} from "../vote-list/vote-list";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {Vote} from "../../providers/declarations/Vote";

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

  appointments: AppointmentCard[] = [];

  constructor(private popoverCtrl: PopoverController,circleProvider:CircleProvider, navParams:NavParams,
              public modalCtrl: ModalController, private calendarProvider:CalendarProvider) {
    this.circleId = navParams.get('circleId');

    this.loadAppointments();

    circleProvider.getUserRole(this.circleId).subscribe(data => {
      this.userRole = data.role;
    });
  }

  @Input()
  set date(date:Date) {
    this.filteredAppointments = this.appointments.filter(
      appointment => isSameDay(date,new Date(appointment.appointment.startDate))
    );
    this.filteredDate = date;
  }

  toggleVote(appointmentCard:AppointmentCard, vote:Vote) {
     if(appointmentCard.vote===vote) {
       this.calendarProvider.voteForAppointment(appointmentCard.appointment.id,Vote.NONE);
       appointmentCard.vote=Vote.NONE;
     }else{
       this.calendarProvider.voteForAppointment(appointmentCard.appointment.id,vote);
       appointmentCard.vote=vote;
     }
  }

  openModal(appointment: Appointment) {

    let modal = this.modalCtrl.create(VoteListPage, {appointemntId: appointment.id});
    modal.present();
  }

  presentPopover(appointment:Appointment) {

    let popover = this.popoverCtrl.create(PopoverTimelinePage,{circleId:this.circleId, appointment:appointment});
    popover.onDidDismiss(() => this.loadAppointments());

    popover.present({
      ev: event
    });
  }

  private loadAppointments() {
    this.calendarProvider.getAllCalendarEntries(this.circleId).subscribe(data => {
      this.appointments = [];
      data.forEach(appointment =>{
        this.appointments.push({appointment:appointment, vote:Vote.NONE});
      });
      if(this.filteredDate!=null){
        this.filteredAppointments = this.appointments.filter(
          appointment => isSameDay(this.filteredDate,new Date(appointment.appointment.startDate))
        );
      } else{
        this.filteredAppointments = this.appointments;
      }
    });
  }
}

@Component({
  selector: 'timeline-page',
  templateUrl: 'timeline-page.html',
})

export class TimelinePage {

  userRole:string = '';

  constructor() {
  }

}

export interface AppointmentCard{
  appointment:Appointment
  vote:Vote;
}
