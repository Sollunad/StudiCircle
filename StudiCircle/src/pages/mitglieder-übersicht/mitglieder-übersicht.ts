import { Component } from '@angular/core';
import {CircleProvider} from "../../providers/api/CircleProvider";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: Array<string> = [];

  constructor(public circleProvider: CircleProvider, public http: HttpClient) {
  }

  ionViewDidLoad(){
    //TODO Use specific circleId
    this.memberList = this.circleProvider.getMemberListByCircleId(1);
  }


  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
