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
  private isAdmin : boolean;

  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
    this.isAdmin = navParams.get('isAdmin');
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

  promoteToModerator(userId: number, circleId: number){
    this.circleProvider.changeRole(userId, circleId, "moderator").subscribe();
    window.location.reload();
  }

  demoteModerator(userId: number, circleId: number){
    this.circleProvider.changeRole(userId, circleId, "member").subscribe();
    window.location.reload();
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
}
