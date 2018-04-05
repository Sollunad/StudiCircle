import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  messages = [];
  nickname = '';
  message = '';
  socket:any;

  constructor(private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController,
              private alerCtrl: AlertController) {
    this.nickname = "Test";
    this.socket=io('http://localhost:3001');
    this.socket.emit('set-nickname', this.nickname);

    this.getMessages().subscribe(message => {
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
