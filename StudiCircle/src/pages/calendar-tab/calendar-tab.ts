import {CalendarPage} from "../calendar/calendar";
import {Component} from "@angular/core";
import {TimelinePage} from "../timeline/timeline";

@Component({
  selector: 'page-calendar-tab',
  templateUrl: 'calendar-tab.html',
})
export class CalendarTabPage {
  calendarPage = CalendarPage;
  timelinePage = TimelinePage;
}
