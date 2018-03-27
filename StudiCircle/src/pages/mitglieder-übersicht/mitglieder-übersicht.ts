import { Component } from '@angular/core';
import {CircleProvider} from "../../providers/api/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {NavParams} from "ionic-angular";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: Array<string> = [];

  private circleId : number;

  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
  }

  ionViewDidLoad(){
    //TODO Use specific circleId
    this.memberList = this.circleProvider.getMemberListByCircleId(this.circleId);
  }


  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
