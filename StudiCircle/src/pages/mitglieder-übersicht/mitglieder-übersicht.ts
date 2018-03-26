import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import {CircleProvider} from "../../providers/api/CircleProvider";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: Array<string>;

  constructor(public circleProvider: CircleProvider, public http: HttpClient) {
  }

  ionViewDidLoad(){
    //this.memberList = this.circleProvider.getMemberListbyCircleId(2323);
    this.http.get('http://localhost:8080/circle/members?id=1',).map(res => res.json()).subscribe((memberList) => {
      console.log(memberList);
      this.memberList = memberList;
    });
    //console.log("Selected Item", this.memberList);
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
