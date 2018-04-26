import { Component } from '@angular/core';
import {NavParams, Platform, ViewController} from 'ionic-angular';
import {CalendarProvider} from "../../providers/calendar/CalendarProvider";
import {Vote} from "../../providers/declarations/Vote";
import {UserVote} from "../../providers/declarations/UserVote";

/**
 * Generated class for the VoteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-vote-list',
  templateUrl: 'vote-list.html',
})
export class VoteListPage {


  userList: UserVote[] = [];

  vote = Vote;

  appointemntId:number;

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, calendarProvider:CalendarProvider) {

    this.appointemntId = params.get('appointmentId');

    calendarProvider.getVoteList(this.appointemntId).subscribe(data=>{
      this.userList=data;
      console.log(data);
    });

    //TODO decentralize data storage for appointments
    //TODO Maybe add load spinner

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
