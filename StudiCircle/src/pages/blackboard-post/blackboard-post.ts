import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BlackboardPost} from '../../providers/declarations/BlackboardPost';
import {ApiProvider} from '../../providers/api/api';
import {DbProvider} from '../../providers/dbprovider/dbprovider';
import {Subscription} from "rxjs/Subscription";

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
  private db: any;
  private comments = new Array<BlackboardPost>();
  private post: BlackboardPost;
  private comment: any;
  private input: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private dbprovider: DbProvider) {
  }

  ionViewDidLoad() {
    this.post = this.navParams.get('post');
    this.postCreator = this.post.userName;
    this.postText = this.post.text;
    this.postDate = this.post.date;
    const subs: Subscription = this.dbprovider.getComments(this.post.postID).subscribe((data:any[]) => {
      console.log(data);
      if( data == []){
        this.comments = []
      }
      this.comments = data;
      subs.unsubscribe();
    });
  }

  private sendComment() {
    let tmpInput = this.input;
    this.input = "";
    this.comment = {postID: this.post.postID, body: tmpInput};
    const subs: Subscription = this.dbprovider.postComment(this.comment).subscribe((data:any[]) => {
      console.log(data);
      subs.unsubscribe();
    });
  }


}
