import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, ToastController, AlertController, Content} from 'ionic-angular';
import Socket = SocketIOClient.Socket;
import { Observable } from 'rxjs/Observable';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {ApiProvider} from "../../providers/api/api";

@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  messages = [];
  nickname = '';
  message = '';
  socket:Socket;
  circleId : number;
  showEmojiPicker = false;



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

    this.getDeletedMessages().subscribe(data => {
      console.log(data);
      this.messages = this.messages.filter(message => message.messageId !== data.id);
    })
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  handleSelection(event) {
    this.message = this.message + " " + event.char;
  }

  sendMessage() {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
    this.onFocus();
  }

  deleteMessage(messageId:number) {
    this.socket.emit('delete-message', { messageId: messageId });
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getDeletedMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message-deleted', (data) => {
        observer.next(data);
      });
    });
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

  doConfirm(messageId:number) {
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
            this.deleteMessage(messageId);
            console.log('Nachricht löschen'+messageId);
          }
        }
      ]
    });
    confirm.present()
  }
}
