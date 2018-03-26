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

  constructor(public circleProvider: CircleProvider) {
  }

  ionViewDidLoad(){
    //this.memberList = this.circleProvider.getMemberListbyCircleId(2323);
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
