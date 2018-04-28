import {Component, Input} from "@angular/core";
import {PopoverController, NavParams, ModalController} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {Appointment} from "../../providers/declarations/Appointment";
import * as isSameDay from 'date-fns/is_same_day';
import {VoteListPage} from "../vote-list/vote-list";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {Vote} from "../../providers/declarations/Vote";
import {containerStart} from "@angular/core/src/render3/instructions";

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html',
})

export class Timeline {

  vote = Vote;

  circleId:number;

  public filteredAppointments:Appointment[]=[];

  @Input()
  userRole:string;

  calendarPro:CalendarProvider;


  constructor(private popoverCtrl: PopoverController,circleProvider:CircleProvider, navParams:NavParams,
              public modalCtrl: ModalController, public calendarProvider:CalendarProvider) {
    this.circleId = navParams.get('circleId');

    this.calendarPro = calendarProvider;

    this.loadAppointments();

    circleProvider.getUserRole(this.circleId).subscribe(data => {
      this.userRole = data.role;
    });
  }

  @Input()
  set date(date:Date) {
    this.calendarProvider.filteredAppointments = this.calendarProvider.appointments.filter(
      appointment => isSameDay(date,new Date(appointment.startDate))
    );
    this.calendarProvider.filteredDate = date;
  }

  toggleVote(appointment:Appointment, vote:Vote) {
    //console.log(this.calendarProvider.filteredAppointments.indexOf(appointment));
     if(appointment.userVote===vote) {
       this.calendarProvider.voteForAppointment(appointment.id,Vote.NONE).subscribe(data=>console.log(data));
       appointment.userVote=Vote.NONE;
       this.incrementBy(appointment,vote,-1);
     }else{
       if(vote!==Vote.NONE){
         console.log('test');
         this.incrementBy(appointment, appointment.userVote,-1);
       }
       this.calendarProvider.voteForAppointment(appointment.id,vote).subscribe(data=>console.log(data));
       appointment.userVote=vote;
       this.incrementBy(appointment,vote,1);
     }
  }

  incrementBy(appointment:Appointment, vote:Vote, count:number){
    switch (vote){
      case Vote.COMMIT:
        appointment.countCommits += count;
        break;

      case Vote.REJECT:
        appointment.countRejections += count;
        break;

      case Vote.INTERESTED:
        appointment.countInterested += count;
        break;
    }
  }

  openModal(appointment: Appointment) {

    let modal = this.modalCtrl.create(VoteListPage, {appointmentId: appointment.id});
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
    this.calendarProvider.test(this.circleId);
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
