import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BlackboardPage } from '../blackboard/blackboard';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.postCreator = "Test User";
    this.postDate = "06.04.2018"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlackboardPostPage');
  }

}
