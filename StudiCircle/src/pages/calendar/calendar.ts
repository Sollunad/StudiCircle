import {Component, OnInit} from "@angular/core";
import {NavController, ModalController, AlertController, NavParams} from "ionic-angular";
import * as moment from 'moment';
import {EventModalPage} from "../event-modal/event-modal";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {AppointmentCard} from "../timeline/timeline";
import {CalendarComponentOptions, DayConfig} from "ion2-calendar";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {Vote} from "../../providers/declarations/Vote";
registerLocaleData(localeDe);

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnInit{

  eventSource = [];
  viewTitle: string;
  selectedDay: Date;
  circleId:number;
  userRole:string= 'admin';

  options:CalendarComponentOptions;
  dates:Array<DayConfig>=[];

  appointments: AppointmentCard[] = [];

  date: string = new Date().toDateString();

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'de-DE'
  };

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController,
              navParams: NavParams, circleProvider:CircleProvider, private calendarProvider:CalendarProvider) {

    this.circleId = navParams.get('circleId');

    calendarProvider.getAllCalendarEntries(this.circleId).subscribe(data => {
      data.forEach(appointment =>{
        this.appointments.push({appointment:appointment, vote:Vote.NONE});
      });
      this.options = {};
      this.dates = this.fillUpCalendar(this.appointments);
      this.options.daysConfig = this.dates;
      this.options.from = new Date('2010-01-01T00:00:00.000Z');
      this.options.to = 0;
    });



    /*circleProvider.getUserRole(this.circleId).subscribe(data => {
      this.userRole = data.role;
    });*/
  }

  ngOnInit() {
    this.calendarProvider.getAllCalendarEntries(this.circleId).subscribe(data => {
      data.forEach(appointment =>{
        this.appointments.push({appointment:appointment, vote:Vote.NONE});
      });
      this.dates = this.fillUpCalendar(this.appointments);
      this.options.daysConfig = this.dates;
      this.options.from = new Date('2010-01-01T00:00:00.000Z');
      this.options.to = 0;
    });
  }

  ionViewDidLoad(){
    this.selectedDay = moment().startOf('day').toDate();
  }


  fillUpCalendar(appointmentList:AppointmentCard[]):Array<DayConfig>{
    let dateList:Array<DayConfig> = [];
    appointmentList.forEach(appointment => {
      console.log(appointment);
      dateList.push({date:new Date(appointment.appointment.startDate),subTitle:'●'});
    });
    return dateList;
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
}
