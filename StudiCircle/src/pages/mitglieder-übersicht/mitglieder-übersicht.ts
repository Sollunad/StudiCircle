import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {NavParams} from "ionic-angular";

@Component({
  templateUrl: 'mitglieder-übersicht.html'
})
export class MitgliederÜbersicht {

  public memberList: UserInfo[];

  private circleId : number;

  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
  }

  ionViewDidLoad(){
    this.circleProvider.getMemberListByCircleId(this.circleId).subscribe(
        memberList => this.memberList = memberList
    );
  }

  removeCircleMember(userId: number, circleId: number){
    this.circleProvider.removeCircleMember(userId, circleId).subscribe();
    window.location.reload();
    }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
