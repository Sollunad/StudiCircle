import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';

/**
 * Generated class for the VoteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vote-list',
  templateUrl: 'vote-list.html',
})
export class VoteListPage {

  userList:string[] = ['Michael Ballack', 'Thorsten Frings'];

  appointemntId:number;

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {

    this.appointemntId = params.get('appointmentId');

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
