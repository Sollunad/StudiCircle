import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BlackboardPage } from '../blackboard/blackboard';
import { BlackboardPost } from '../../providers/declarations/BlackboardPost'

/**
 * Generated class for the BlackboardPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blackboard-post',
  templateUrl: 'blackboard-post.html'
})
export class BlackboardPostPage {
  private postCreator: String;
  private postDate: String;
  private postText: String;
  private comments : BlackboardPost[];
  private postID: BlackboardPost;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.postID = this.navParams.get('post');
    this.postCreator = "Test User";
    this.postDate = "06.04.2018";
    this.postText = "This is my first Post";
    this.comments = [{postID: this.postID.postID, userName: "Jonas", text: "Schlechter Beitrag", date: "20160215"},
                    {postID: this.postID.postID, userName: "Jonas", text: "Schlechter Beitrag", date: "20160215"}];
  }

}
