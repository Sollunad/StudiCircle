import {Component} from "@angular/core";
import {PopoverController, NavParams} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {Appointment} from "../../providers/declarations/Event";
import * as moment from 'moment';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {

  circleId:number;
  userRole:string= 'admin';

  appointments: Appointment[] = [{id: 1, title: 'Basketball', description: 'Tolles Event', location: 'Mannheim', startDate: moment().toISOString(),
    endDate: moment().toISOString() ,countCommits: 12,countRejections: 2, countInterested: 7},
    {id: 2, title: 'Fußball', description: 'Beste Sport wo gibbet', location: 'Borussia-Park', startDate: moment().toISOString(),
      endDate: moment().toISOString() ,countCommits: 42,countRejections: 12, countInterested: 27}];

  constructor(private popoverCtrl: PopoverController,circleProvider:CircleProvider, navParams:NavParams) {
    this.circleId = navParams.get('circleId');
    console.log(moment().toISOString());

    /*circleProvider.getUserRole(this.circleId).subscribe(data => {
     this.userRole = data.role;
     });*/
  }



  presentPopover(event) {

    let popover = this.popoverCtrl.create(PopoverTimelinePage);

    popover.present({
      ev: event
    });
  }

}
