import { Component } from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {Observable} from "rxjs";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: UserInfo[];

  constructor(public circleProvider: CircleProvider, public http: HttpClient) {
  }

  ionViewDidLoad(){
    //TODO Use specific circleId instead of 1

    this.circleProvider.getMemberListByCircleId(1).subscribe(
        memberList => this.memberList = memberList
    );
  }


  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
