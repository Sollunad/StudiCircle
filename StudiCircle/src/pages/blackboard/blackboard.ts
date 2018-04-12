import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DbProvider } from "../../providers/dbprovider/dbprovider";
import {ApiProvider} from "../../providers/api/api";
import { BlackboardPost } from "../../providers/declarations/BlackboardPost";
import { BlackboardPostPage } from "../blackboard-post/blackboard-post";
import {Subscription} from "rxjs/Subscription";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";

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
  private date = new Date();
  private userName = 'Hans Solo';

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private circleProvider: CircleProvider, private dbProvider: DbProvider) {
  }

  ionViewDidLoad() {
    this.getAllPostsOfBlackboard();
  }

    //get the first 3 comments of every post

  /*private showPost(post: any) {
    console.log(this.posts[post].userName);
    this.navCtrl.push(BlackboardPostPage, { post: this.posts[post] });
  }*/

  private addPost() {
    this.alertCtrl.create({
      title: 'Enter Text',
      inputs: [{
        name: 'title',
        placeholder: 'title'
      }, {
        name: 'text',
        placeholder: 'Type here ...'
      }],
      buttons: [{
        text: 'OK',
        handler: data => {
          const title = data.title.toString().trim();
          if(title.length < 5) return;

          const text = data.text.toString().trim();
          if (text.length < 10) return;

          this.insertPost(title, text);
        }
      }]
    }).present();
  }

  private insertPost(title: string, text: string) {
    console.log('new post', title, text);
    this.circleProvider.insertPost(this.circleId, title, text).subscribe(post => {
      console.log('post', post);
      this.posts.push(post);
    });
  }

  private showPost(post: number) {
    this.navCtrl.push(BlackboardPostPage, {
        post: this.posts[post]
      });
  }

  private deletePost(post: BlackboardPost) {
    console.log('deletePost', post);
    this.circleProvider.deletePost(post.postID);
  }

  private getAllPostsOfBlackboard(){
    //array to store comments temporarily
    let comments = new Array<BlackboardPost>();
      // get the posts in this circle
    const subs: Subscription = this.dbProvider.getBlackboardPosts(this.circleId).subscribe((data:any[]) => {
    console.log(data);
      //iterate over all posts
      subs.unsubscribe();
        for(let post of data){
        // push 3 comments in comments-object
          for(let comment of post.Comments){
            if(comment.PostId === post.id){
                comments.push({postID: comment.id, userName: comment.User.name, title: 'Titel', text: comment.body, date: comment.createdAt});
            }
          }
          this.posts.push({postID: post.id, userName: post.User.name, title: 'Titel', text: post.body, date: post.createdAt, comments: comments});
          comments = [];
        }
      }, (err: any) => {
        // Error-Handling
        console.log(err);
      });
    }
}
