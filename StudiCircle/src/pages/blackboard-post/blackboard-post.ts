import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BlackboardPage } from '../blackboard/blackboard';
import { BlackboardPost } from '../../providers/declarations/BlackboardPost'
import { ApiProvider } from '../../providers/api/api'
/**
 * Generated class for the BlackboardPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blackboard-post',
  templateUrl: 'blackboard-post.html'
})
export class BlackboardPostPage {
  private postCreator: String;
  private postDate: String;
  private postText: String;
  private comments: BlackboardPost[];
  private post: BlackboardPost;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.post = this.navParams.get('post');
    let option = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    this.postCreator = this.post.userName;
    this.postText = this.post.text;
    this.postDate = this.post.date;
    this.comments = [
      {
        postID: 1,
        userName: 'Jonas',
        text: 'Schlechter Beitrag',
        date: new Date().toLocaleString('de-DE', option)
      },
      {
        postID: 2,
        userName: 'Jesse',
        text: 'Schnauze!!!',
        date: new Date().toLocaleString('de-DE', option)
      }
    ];
  }

  private sendComment() {
    let tmpInput = this.input;
    this.input = "";
    let comment = {};
    comment.postID = this.post.postID;
    comment.text = tmpInput;
    comment.userID = this.api.currentUser.uuid;
    comment.date = new Date().toDateString;
    console.log(comment);
  }


}
