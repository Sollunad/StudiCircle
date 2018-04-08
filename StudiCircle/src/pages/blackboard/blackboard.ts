import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DbProvider } from "../../providers/dbprovider/dbprovider";
import {ApiProvider} from "../../providers/api/api";
import { BlackboardPost } from "../../providers/declarations/BlackboardPost";
import { BlackboardPostPage } from "../blackboard-post/blackboard-post";

/**
 * Generated class for the BlackboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blackboard',
  templateUrl: 'blackboard.html',
})
export class BlackboardPage {

  private circleId = this.navParams.get('circleId');
  private posts = new Array<BlackboardPost>();

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private dbProvider: DbProvider, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');

    // get the posts in this circle
    this.posts = this.dbProvider.getBlackboardPosts(this.circleId);

    //get the first 3 comments of every post

    console.log(this.circleId);
  }

  private showPost(post: any) {
    console.log(this.posts[post].userName);
    this.navCtrl.push(BlackboardPostPage, { post: this.posts[post] });
  }

  private addPost() {
    this.alertCtrl.create({
      title: 'Enter Text',
      inputs: [{
        name: 'text',
        placeholder: 'Type here ...'
      }],
      buttons: [{
        text: 'OK',
        handler: data => {
          var text = data.text;

          this.insertPost(text);
        }
      }]
    }).present();
  }

  private insertPost(text: string) {
    var post: BlackboardPost = {
      postID: 0,
      userName: this.api.currentUser.username,
      text: text,
      date: new Date().toString()
    };

    console.log('new post', post);
  }

  private deletePost(post: any) {
    if (this.dbProvider.deletePost(post) === 1) {
      this.posts.splice(post, 1);
    }
    else {
      console.log("Fehler beim Löschen des Posts " + post);
    }
  }

}
