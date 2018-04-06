import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider} from "../../providers/dbprovider/dbprovider";
import { BlackboardPost} from "../../providers/declarations/BlackboardPost";
import { BlackboardPostPage} from "../blackboard-post/blackboard-post";

/**
 * Generated class for the BlackboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blackboard',
  templateUrl: 'blackboard.html',
})
export class BlackboardPage {

  private circleId = this.navParams.get('circleId');
  private posts = new Array<BlackboardPost>();

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbProvider: DbProvider) {
  }

  ionViewDidLoad() {
    this.posts = this.dbProvider.getBlackboardPosts(this.circleId);
    console.log(this.circleId);
  }

  private showPost(post: any){
    console.log(this.posts[post].userName);
    this.navCtrl.push(BlackboardPostPage, {post: this.posts[post]});
  }

}
