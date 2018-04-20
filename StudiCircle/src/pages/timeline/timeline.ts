import {Component, Input} from "@angular/core";
import {PopoverController, NavParams, ModalController} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {Appointment} from "../../providers/declarations/Appointment";
import * as isSameDay from 'date-fns/is_same_day';
import {VoteListPage} from "../vote-list/vote-list";

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
              public modalCtrl: ModalController) {
    this.circleId = navParams.get('circleId');
    this.appointments = navParams.get('appointmentList');
    this.filteredAppointments = this.appointments;
  }

  @Input()
  set date(date:Date) {
    this.filteredAppointments = this.appointments.filter(
      appointment => isSameDay(date,new Date(appointment.appointment.startDate))
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

  openModal(appointment: Appointment) {

    let modal = this.modalCtrl.create(VoteListPage, {appointemntId: appointment.id});
    modal.present();
  }

  presentPopover(appointment:Appointment) {

    let popover = this.popoverCtrl.create(PopoverTimelinePage,{circleId:this.circleId, appointment:appointment});

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
