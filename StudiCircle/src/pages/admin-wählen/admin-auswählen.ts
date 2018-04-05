import {Component} from '@angular/core';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../providers/declarations/UserInfo";
import {NavParams} from "ionic-angular";

@Component({
  templateUrl: 'admin-auswählen.html'
})
export class AdminAuswaehlenPage {

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

  selectNewAdmin(userId: number, circleId: number){
    this.circleProvider.selectNewAdmin(userId, circleId).subscribe();
    window.location.reload();
    }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
