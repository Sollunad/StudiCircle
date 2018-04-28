import {CalendarPage} from "../calendar/calendar";
import {Component} from "@angular/core";
import {TimelinePage} from "../timeline/timeline";
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {NavParams, ModalController} from "ionic-angular";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {EventModalPage} from "../event-modal/event-modal";

@Component({
  selector: 'page-calendar-tab',
  templateUrl: 'calendar-tab.html',
})
export class CalendarTabPage {

  userRole:string= '';
  calendarPage:any;
  timelinePage:any;
  params = {};
  circleId:number;
  filteredDate:Date;

  constructor(private calendarProvider:CalendarProvider, navParams:NavParams, circleProvider:CircleProvider, private modalCtrl:ModalController){
    this.circleId = navParams.get('circleId');
    this.params = {circleId:this.circleId};
    this.calendarPage = CalendarPage;
    this.timelinePage = TimelinePage;
    circleProvider.getUserRole(this.circleId).subscribe(data => {
      this.userRole = data.role;
      console.log(this.userRole);
    });
  }

  addEvent() {
    let modal = this.modalCtrl.create(EventModalPage,{circleId:this.circleId});
    modal.onDidDismiss(() => this.loadAppointments());
    modal.present();
  }

  setFilteredDate(){
    if(this.filteredDate!=null){
      this.calendarProvider.filteredDate = this.filteredDate;
      this.calendarProvider.filterDate();
    }
  }

  removeFilteredDate(){
    this.filteredDate = this.calendarProvider.filteredDate;
    this.calendarProvider.filteredDate=null;
    this.calendarProvider.filterDate();
  }

  private loadAppointments() {
    this.calendarProvider.test(this.circleId);
  }
}

