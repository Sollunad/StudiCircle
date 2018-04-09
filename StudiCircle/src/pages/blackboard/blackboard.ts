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
  private posts = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private dbProvider: DbProvider) {
  }

  ionViewDidLoad() {
    console.log(this.circleId);

    this.dbProvider.getBlackboardPosts(this.circleId).subscribe(posts => {
      console.log('getBlackboardPosts', posts);
      this.posts = posts;
    });

    // TODO: get the first 3 comments of every post
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
          const text = data.text.toString().trim();
          if(text.length < 10) return;

          this.insertPost(text);
        }
      }]
    }).present();
  }

  private insertPost(text: string) {
    console.log('new post', text);
    this.dbProvider.insertPost(this.circleId, text).subscribe(data => {
      console.log('data', data);
    });
  }

  private showPost(post: BlackboardPost) {
    console.log('showPost', post);
    this.navCtrl.push(
      BlackboardPostPage, {
        post: post
      });
  }

  private deletePost(post: BlackboardPost) {
    console.log('deletePost', post);
    this.dbProvider.deletePost(post.postID);
  }

}
