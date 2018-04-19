
import {Component} from "@angular/core";
import {NavController, ModalController, AlertController, NavParams} from "ionic-angular";
import * as moment from 'moment';
import {EventModalPage} from "../event-modal/event-modal";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {AppointmentCard} from "../timeline/timeline";
registerLocaleData(localeDe);

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  eventSource = [];
  viewTitle: string;
  selectedDay: Date = new Date();
  circleId:number;
  userRole:string= 'admin';


  date: string;
  type: 'moment'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  appointments: AppointmentCard[] = [
    {appointment: {id: 1, title: 'Basketball', description: 'Tolles Event', location: 'Mannheim', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T18:40:37.049Z' ,countCommits: 12,countRejections: 2, countInterested: 7},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-15T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-18T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 1, title: 'Basketball', description: 'Tolles Event', location: 'Mannheim', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T18:40:37.049Z' ,countCommits: 12,countRejections: 2, countInterested: 7},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-15T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-14T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'},
    {appointment: {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: '2018-04-13T18:40:37.049Z',
      endDate: '2018-04-18T19:40:37.049Z' ,countCommits: 42,countRejections: 12, countInterested: 27},vote:'none'}];



  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'de-DE'
  };

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController,
              navParams: NavParams, circleProvider:CircleProvider) {

    this.circleId = navParams.get('circleId');

    /*circleProvider.getUserRole(this.circleId).subscribe(data => {
      this.userRole = data.role;
    });*/
  }

  addEvent() {
    let modal = this.modalCtrl.create(EventModalPage);
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
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = moment(ev).toDate();
  }
}
