import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import Socket = SocketIOClient.Socket;
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {ApiProvider} from "../../providers/api/api";
import {UserInfo} from "../../providers/declarations/UserInfo";

@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  messages = [];
  nickname = '';
  message = '';
  socket:Socket;
  circleId : number;


  constructor(private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController,
              private alerCtrl: AlertController, private circleProvider:CircleProvider, private apiProvider: ApiProvider) {

    this.circleId = navParams.get('circleId');

    this.nickname = apiProvider.getCurrentUser().username;

    this.socket=circleProvider.openSocketConnection(this.circleId);

    this.getMessages().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    });

    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  }

  sendMessage() {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  doConfirm() {
    //TODO check whether user is allowed to remove messages

    let confirm = this.alerCtrl.create({
      title: 'Nachricht löschen?',
      message: 'Möchten Sie diese Nachricht wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {
            console.log('Abbrechen');
          }
        },
        {
          text: 'Nachricht löschen',
          handler: () => {
            console.log('Nachricht löschen');
          }
        }
      ]
    });
    confirm.present()
  }
}
