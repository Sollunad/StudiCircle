import {Component, OnInit} from "@angular/core";
import {NavController, ModalController, AlertController, NavParams} from "ionic-angular";
import * as moment from 'moment';
import {EventModalPage} from "../event-modal/event-modal";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {CalendarComponentOptions, DayConfig} from "ion2-calendar";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {Vote} from "../../providers/declarations/Vote";
import {Appointment} from "../../providers/declarations/Appointment";
registerLocaleData(localeDe);

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage{

  eventSource = [];
  viewTitle: string;
  selectedDay: Date = new Date(moment().startOf('day').format());
  circleId:number;
  userRole:string= 'admin';


  date: string = new Date().toDateString();

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'de-DE'
  };

  calendarPro:CalendarProvider;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController,
              navParams: NavParams, circleProvider:CircleProvider, private calendarProvider:CalendarProvider) {

    this.calendarPro = calendarProvider;

    this.circleId = navParams.get('circleId');

    this.loadAppointments();
  }

  addEvent() {
    let modal = this.modalCtrl.create(EventModalPage,{circleId:this.circleId});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = moment(ev).toDate();
  }

  private loadAppointments() {
    var test:Date;
    test = new Date(moment().startOf('day').format());
    console.log(test);
    test = moment().startOf('day').toDate();
    console.log(test);
    test = new Date(moment().startOf('day').toISOString());
    console.log(test);
    this.calendarProvider.filteredDate = new Date(moment().startOf('day').format());
    console.log(this.calendarProvider.filteredDate);
    this.calendarProvider.test(this.circleId);
  }
}
