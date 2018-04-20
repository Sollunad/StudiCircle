import {CalendarPage} from "../calendar/calendar";
import {Component} from "@angular/core";
import {TimelinePage, AppointmentCard} from "../timeline/timeline";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {NavParams} from "ionic-angular";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";

@Component({
  selector: 'page-calendar-tab',
  templateUrl: 'calendar-tab.html',
})
export class CalendarTabPage {

  appointments: AppointmentCard[] = [];
  userRole:string= 'admin';
  calendarPage:any;
  timelinePage:any;
  params = {};

  constructor(calendarProvider:CalendarProvider, navParams:NavParams, circleProvider:CircleProvider){
    let circleId = navParams.get('circleId');
    calendarProvider.getAllCalendarEntries(circleId).subscribe(data => {
      data.forEach(appointment =>{
        this.appointments.push({appointment:appointment, vote:'none'});
      });
    });
    this.params = {appointmentList: this.appointments, circleId:circleId};
    this.calendarPage = CalendarPage;
    this.timelinePage = TimelinePage;
    circleProvider.getUserRole(circleId).subscribe(data => {
      this.userRole = data.role;
    });
    console.log(this.params);
  }
}

