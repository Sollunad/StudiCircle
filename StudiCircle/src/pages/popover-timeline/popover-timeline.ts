import {Component} from '@angular/core';
import {NavParams, ModalController, ViewController} from "ionic-angular";
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

  constructor(private navParams: NavParams, public calendarProvider:CalendarProvider, private modalCtrl: ModalController,
              public viewCtrl: ViewController) {
    this.appointment = navParams.get('appointment');
    this.circleId = navParams.get('circleId');
  }

  editAppointment(){
      let newAppointment= Object.assign({}, this.appointment);
      let modal = this.modalCtrl.create(EventModalPage,{circleId:this.circleId, appointment:newAppointment});
      modal.present();
      modal.onDidDismiss(data => this.viewCtrl.dismiss());
  }

  deleteAppointment(){
    console.log("Test");
    this.calendarProvider.deleteCalendarEntry(this.appointment.id).subscribe(data => console.log(data));
    this.viewCtrl.dismiss();
  }
}
