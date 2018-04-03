import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  messages = [];
  nickname = '';
  message = '';

  constructor(private navCtrl: NavController, private navParams: NavParams, private socket: Socket, private toastCtrl: ToastController) {
    this.nickname = "Test";
    this.socket.connect();
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
}
