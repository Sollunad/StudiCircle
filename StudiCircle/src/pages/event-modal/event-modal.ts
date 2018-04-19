import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import * as moment from 'moment';
import {DatePickerProvider} from "ionic2-date-picker";

@Component({
  selector: 'event-modal',
  templateUrl: 'event-modal.html',
})

export class EventModalPage {

  event = { title: "", description: "", place:"", startTime: moment().format(), endTime: moment().add(2, 'hours').format(), allDay: false };
  minDate = new Date().toISOString();

  constructor(public navCtrl: NavController, public viewCtrl: ViewController,
              private datePickerProvider: DatePickerProvider, public modalCtrl: ModalController) {
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
    this.viewCtrl.dismiss(this.event);
  }
}
