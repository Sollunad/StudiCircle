import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, Content, NavParams, ToastController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {ApiProvider} from "../../providers/api/api";
import {ChatProvider} from "../../providers/chat/ChatProvider";
import {Message} from "../../providers/declarations/Message";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import Socket = SocketIOClient.Socket;

@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  messages : Message[] = [];
  nickname = '';
  message = '';
  socket:Socket;
  circleId : number;
  showEmojiPicker = false;
  userRole :string;

  private loadedAllMessages: boolean = false;



  constructor(private navParams: NavParams, private toastCtrl: ToastController,
              private alerCtrl: AlertController, private apiProvider: ApiProvider, private chatProvider:ChatProvider,
              private circleProvider:CircleProvider) {

    this.circleId = navParams.get('circleId');

    this.nickname = apiProvider.getCurrentUser().username;

    this.socket=chatProvider.openSocketConnection(this.circleId);

    this.getMessages().subscribe(data => {
      let message:any=data;
      const messageObject = {} as Message;
      messageObject.created = message.created;
      messageObject.from = message.from;
      messageObject.messageId = message.messageId;
      messageObject.text = message.text;
      messageObject.userId = message.userId;
      this.messages.push(messageObject);
      console.log(this.messages);
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
      let deletedMessage:any=data;
      console.log(data);
      this.messages = this.messages.filter(message => message.messageId !== deletedMessage.id);
    });

    this.circleProvider.getUserRole(this.circleId).subscribe(data => {
      console.log(data);
      this.userRole = data.role;
    });
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
    //this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(0);
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
    this.scrollToBottom()
  }

  deleteMessage(messageId:number) {
    this.socket.emit('delete-message', { messageId: messageId });
  }

  getMessages() {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
  }

  getDeletedMessages() {
    return new Observable(observer => {
      this.socket.on('message-deleted', (data) => {
        observer.next(data);
      });
    });
  }

  getUsers() {
    return new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  ionViewDidLoad(){
    this.loadMessages();
    this.scrollToBottom();
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

    if(this.userRole==="admin"||this.userRole==="mod") {
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
              console.log('Nachricht löschen' + messageId);
            }
          }
        ]
      });
      confirm.present()
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.loadMessages();
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  private loadMessages() {
    this.chatProvider.loadMessagesFromTo(this.circleId,this.messages.length,30).subscribe(data => {
      this.messages = data.messages.concat(this.messages);
      this.content.scrollTo(0,100,0);
      this.loadedAllMessages = data.moreMessagesExist;
    });
  }
}
