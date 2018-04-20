import { Component } from '@angular/core';
import {NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import * as moment from 'moment';
import {DatePickerProvider} from "ionic2-date-picker";
import {Appointment} from "../../providers/declarations/Appointment";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";

@Component({
  selector: 'event-modal',
  templateUrl: 'event-modal.html',
})

export class EventModalPage {

  event : Appointment = {title: '', description: '', location: '', startDate: moment().format(),
                         endDate: moment().add(2, 'hours').format() ,countCommits: 0,countRejections: 0, countInterested: 0};

  minDate = new Date().toISOString();

  existingAppointment=false;

  circleId:number;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController,
              private datePickerProvider: DatePickerProvider, public modalCtrl: ModalController,
              public calendarProvider:CalendarProvider, navParams:NavParams) {
    this.circleId = navParams.get('circleId');
    let appointment = navParams.get('appointment');
    if(appointment!=null){
      this.event=appointment;
      this.existingAppointment = true;
    }
  }

  showCalendar() {
    const dateSelected =
      this.datePickerProvider.showCalendar(this.modalCtrl);

    dateSelected.subscribe(date =>
      console.log("first date picker: date selected is", date));
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    console.log(this.event);
    if(this.existingAppointment){
      this.calendarProvider.editCalendarEntry(this.circleId,this.event);
    }
    else{
      this.calendarProvider.addCalendarEntry(this.circleId,this.event).subscribe(data => console.log(data));
    }
    this.viewCtrl.dismiss(this.event);
  }
}
