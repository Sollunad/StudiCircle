import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {MitgliederÜbersicht} from "../mitglieder-übersicht/mitglieder-übersicht";
import {HttpClient} from "@angular/common/http";
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {CircleEinstellungenPage} from "../circle-einstellungen/circle-einstellungen";
import {ChatPage} from "../chat/chat";
import {DashboardPage} from "../dashboard/dashboard";
import {CalendarTabPage} from "../calendar-tab/calendar-tab";
import {BlackboardPage} from "../blackboard/blackboard";
import {WipPage} from "../wip/wip";
import {InvitationStatus} from "../../providers/declarations/InvitationStatus";

@Component({
  template: `
    <ion-list radio-group class="popover-page">
      <!--für verschiedene Abschnitte-->
      <ion-row>
        <!--für einzelne Einträge in den Abschnitten-->
        <ion-col style="padding: 0px;">
          <button ion-button full color="danger" (click)="openConfirmDialog()" style="margin: 0px;" icon-end>Circle Verlassen<ion-icon style="font-size: 2em;" name="exit"></ion-icon></button>
        </ion-col>
      </ion-row>
    </ion-list>
  `
})
export class PopoverPage {

  circleId;
  circleName;

  constructor(public circleProvider: CircleProvider, public navParams: NavParams, private alertCtrl: AlertController, public navCtrl: NavController, private viewCtrl: ViewController) {

  }

  openConfirmDialog(){
    this.circleId=this.navParams.data.circleId;
    this.circleName=this.navParams.data.circleName;
    this.circleProvider.getUserRole(this.circleId).subscribe(
      role => {
        if (role.role=="admin") {
          console.log("[ROLE] : "+role.role);
          let alert = this.alertCtrl.create({
            title: 'Verlassen nicht möglich!',
            subTitle: 'Verlassen von '+this.circleName+' nicht möglich! Vor dem Verlassen müssen die Adminrechte weitergegeben werden.',
            buttons: ['OK']
          });
          alert.present();
        } else {
          console.log("[ROLE] : "+role.role);
          let alert = this.alertCtrl.create({
            title: 'Verlassen bestätigen',
            message: this.circleName+' wirklich verlassen?',
            buttons: [
              {
                text: 'Verlassen',
                handler: () => {


                  this.circleProvider.leaveCircle(this.circleId).subscribe(
                    message => {
                      console.log(message);
                      this.viewCtrl.dismiss();
                      this.navCtrl.push(DashboardPage, {'flag':1});
                    }
                  );
              }
              },
              {
                text: 'Abbrechen',
                role: 'cancel',
                handler: () => {
                  console.log('Verlassen abgebrochen');
                  this.viewCtrl.dismiss();
                }
              }
            ]
          });
          alert.present();
        }
      }
    );
  }

}

@Component({
  templateUrl: 'circle-startseite.html'
})
export class CircleStartseite {

  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

  moduleList: Array<{ title: string, mapName: string, component: any, imageName: string }> = [
    {title: 'Blackboard', mapName: 'blackboard', component: BlackboardPage, imageName: 'blackboard.jpg'},
    {title: 'Chat', mapName: 'chat', component: ChatPage, imageName: 'chat.jpg'}
  ];

  circleId: number;

  circleName: string;


  staticModules = [
    {title: 'Rechnungen', mapName: 'bill', component: WipPage, imageName: 'rechnungen.jpg'},
    {title: 'Kalender', mapName: 'calendar', component: CalendarTabPage, imageName: 'kalender.jpg'},
    {title: 'Wetten', mapName: 'bet', component: WipPage, imageName: 'wetten.jpg'},
    {title: 'File-Sharing', mapName: 'filesharing', component: WipPage, imageName: 'file-sharing.jpg'},
    {title: 'Flohmarkt', mapName: 'market', component: WipPage, imageName: 'flohmarkt.jpg'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
              public circleProvider: CircleProvider, private popoverCtrl: PopoverController) {
    this.circleId = navParams.get('circleId');
    this.circleName = navParams.get('circleName');
  }

  ionViewWillEnter(){
    this.loadModules();
  }

    presentPopover(ev) {
      let popover = this.popoverCtrl.create(PopoverPage, {
        circleId: this.circleId,
        circleName: this.circleName
      });
      popover.present({
        ev: ev
      });
    }

    openPage(module) {
      this.navCtrl.push(module.component, {circleId: this.circleId, moduleName: module.title});
    }

    loadModules(){

      this.moduleList = [
        {title: 'Blackboard', mapName: 'blackboard', component: BlackboardPage, imageName: 'blackboard.jpg'},
        {title: 'Chat', mapName: 'chat', component: ChatPage, imageName: 'chat.jpg'}
      ];

      this.circleProvider.getModuleListByCircleId(this.circleId).subscribe(moduleList => {
        console.log(moduleList);
        this.staticModules.forEach(module => {
          for (let entry of moduleList) {
            if (module.mapName == entry)
              this.moduleList.push(module)
          }
        });
        this.moduleList.push({
          title: 'Mitglieder',
          mapName: 'member',
          component: MitgliederÜbersicht,
          imageName: 'mitglieder.jpg'
        });
        this.circleProvider.getUserRole(this.circleId).subscribe(
          role => {
            if (role.role == "admin") {
              console.log("[ROLE] : " + role.role);
              this.moduleList.push({
                title: 'Einstellungen',
                mapName: 'settings',
                component: CircleEinstellungenPage,
                imageName: 'einstellungen.jpg'
              });
            }
          });
      });
    }
}
