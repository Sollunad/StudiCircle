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
  private comments:any[] = new Array();
  private post: any;
  private comment: any;
  private input: String;
  private refresh: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private dbprovider: DbProvider) {
  }

  ionViewDidLoad() {
    this.post = this.navParams.get('post');
    this.postCreator = this.post.User.name;
    this.postText = this.post.body;
    this.postDate = this.post.createdAt;
    this.refresh = setInterval(()=>{
      this.getComments();
    }, 500);
  }

  private sendComment() {
    let tmpInput = this.input;
    this.input = "";
    this.comment = {postID: this.post.id, text: tmpInput};
    const subs: Subscription = this.dbprovider.postComment(this.comment).subscribe((data:any[]) => {
      console.log(data);
      subs.unsubscribe();
    });
  }

  private getComments(){
    const subs: Subscription = this.dbprovider.getComments(this.post.id).subscribe((data:any[]) => {
      if(this.comments.length == 0){
        this.comments = data;
      }else{
        let flag = false;
        for(let element of data){
          for(let element2 of this.comments){
            if(element.id == element2.id){
              flag = false;
              break;
            }else{
              flag = true
            }
          }
          if(flag){
            this.comments.push(element);
          }
        }
      }
      subs.unsubscribe();
    });

  }

  ionViewWillLeave(){
    clearInterval(this.refresh);
    this.comments = [];
  }


}
