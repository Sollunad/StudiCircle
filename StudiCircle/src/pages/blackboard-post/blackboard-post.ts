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
  private post: BlackboardPost;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.post = this.navParams.get('post');
    this.postCreator = this.post.userName;
    this.postDate = this.post.date;
    this.postText = this.post.text;
    this.comments = [{postID: this.post.postID, userName: "Jonas", text: "Schlechter Beitrag", date: "20160215"},
                    {postID: this.post.postID, userName: "Jesse", text: "Schnauze!!!", date: "20160215"}];
  }

}
