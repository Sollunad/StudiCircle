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

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.post = this.navParams.get('post');
    this.postCreator = this.post.userName;
    this.postText = this.post.text;
    this.postDate = this.post.date;
    this.comments = [{userName: "Jonas", text: "Schlechter Beitrag"},
                    {userName: "Jesse", text: "Schnauze!!!"}];
  }

  private sendComment(){
    let tmpInput = this.input;
    this.input = "";
    this.comments.push({userName: this.api.currentUser.username, text: tmpInput});
  }


}
