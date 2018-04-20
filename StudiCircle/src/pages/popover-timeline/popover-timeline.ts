import {Component} from '@angular/core';
import {NavParams, ModalController} from "ionic-angular";
import {Appointment} from "../../providers/declarations/Appointment";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {EventModalPage} from "../event-modal/event-modal";


@Component({
  selector: 'popover-timeline',
  templateUrl: 'popover-timeline.html',
})
export class PopoverTimelinePage {
  background: string;
  contentEle: any;
  textEle: any;
  fontFamily;
  appointment:Appointment;
  circleId:number;

  constructor(private navParams: NavParams, public calendarProvider:CalendarProvider, private modalCtrl: ModalController) {
    this.appointment = navParams.get('appointment');
    this.circleId = navParams.get('circleId');
  }

  editAppointment(){
      let modal = this.modalCtrl.create(EventModalPage,{circleId:this.circleId, appointment:this.appointment});
      modal.present();
  }

  deleteAppointment(){
    this.calendarProvider.deleteCalendarEntry(this.circleId,1);
  }
}
