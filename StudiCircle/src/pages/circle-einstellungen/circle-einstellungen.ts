import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";
import {HttpClient} from "@angular/common/http";
import {DashboardPage} from "../dashboard/dashboard";
import {AdminAuswaehlenPage} from "../admin-wählen/admin-auswählen";

@Component({
  selector: 'page-circle-einstellungen',
  templateUrl: 'circle-einstellungen.html'
})

export class CircleEinstellungenPage {

  circleId : number;
  private visibility : string = "1";
  private calendar: boolean = true;
  private bill: boolean = true;
  private bet: boolean = true;
  private filesharing: boolean = true;
  private market: boolean = true;


  constructor(public circleProvider: CircleProvider, public http: HttpClient, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams) {
    this.circleId = navParams.get('circleId');
  }

  ionViewDidLoad() {
    console.log(this.circleProvider.getCircleVisibility(this.circleId).subscribe(actualvisibility =>
    {
      if(actualvisibility){
        this.visibility = "1";
      } else {
        this.visibility = "0";
      }
    }
    ));
    console.log("Aktivierte Module:" + this.circleProvider.getModuleListByCircleId(this.circleId).subscribe(modules =>
      this.mapModulesFromArraytoBool(modules)
    ));
  }

  openConfirmDialog() {
    let alert = this.alertCtrl.create({
      title: 'Löschung bestätigen',
      message: 'Circle wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: () => {
            this.circleProvider.removeCircleByCircleId(this.circleId).subscribe(
              message => console.log(message)
            );
            this.navCtrl.push(DashboardPage);
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Löschung abgebrochen');
          }
        }
      ]
    });
    alert.present();
  }

  openModuleSelect() {
    let alert = this.alertCtrl.create({
      title: 'Module',
      message: 'Wählen sie alle im Circle nutzbaren Module!',
      inputs: [
        {
          id: 'calendar',
          type: 'checkbox',
          label: 'Kalender',
          value: 'calendar',
          checked: this.calendar
        },
        {
          id: 'bill',
          type: 'checkbox',
          label: 'Rechnungen',
          value: 'bill',
          checked: this.bill
        },
        {
          id: 'bet',
          type: 'checkbox',
          label: 'Wetten',
          value: 'bet',
          checked: this.bet,

        },
        {
          id: 'file',
          type: 'checkbox',
          label: 'Filesharing',
          value: 'filesharing',
          checked: this.filesharing
        },
        {
          id: 'market',
          type: 'checkbox',
          label: 'Flohmarkt',
          value: 'market',
          checked: this.market,
        }
      ],
      buttons: [
        {
          text: 'Speichern',
          handler: modules => {

            this.mapModulesFromArraytoBool(modules);

            const modification = this.circleProvider.editModules(this.circleId,this.calendar,this.bill,this.bet,this.filesharing,this.market).subscribe(
              (success: boolean) => {
                if(success){
                  console.log("[Modules] : Modules edit successful");
                  modification.unsubscribe();
                  return true;
                }else{
                  console.log("[Modules] : Modules edit not successful");
                  modification.unsubscribe();
                  return false;
                }
              }
            );
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Moduländerung abgebrochen');
          }
        }
      ]
    });
    alert.present();
  }

  openConfirmDialog2() {
    let alert = this.alertCtrl.create({
      title: 'Änderung bestätigen',
      message: 'Sichtbarkeit wirklich ändern?',
      buttons: [
        {
          text: 'Speichern',
          handler: () => {
            console.log('gespeichert');
            this.editVisibility();
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('canceled');
          }
        }
      ]
    });
    alert.present();
  }

  onChange(){
    console.log(this.visibility);
  }

  editVisibility(){
    console.log(this.visibility);
    const modification = this.circleProvider.edit(this.circleId, this.visibility).subscribe(
    (success: boolean) => {
          if(success){
            console.log("[Visibility] : Visibility edit successful");
            modification.unsubscribe();
            return true;
          }else{
            console.log("[Visibility] : Visibility edit not successful");
            modification.unsubscribe();
            return false;
          }
      }
    )
  }

  openAdminSelect(){
    this.navCtrl.push(AdminAuswaehlenPage,{circleId: this.circleId});
  }

  mapModulesFromArraytoBool(modules: any){
    this.calendar = false; this.bill = false; this.bet = false; this.filesharing = false; this.market = false;

    for (let module of modules){
      console.log(module)
      switch(module){
        case 'calendar': this.calendar = true; break;
        case 'bill': this.bill = true; break;
        case 'bet': this.bet = true; break;
        case 'filesharing': this.filesharing = true; break;
        case 'market': this.market = true; break;
        case 'blackboard': break;
        case 'chat': break;
        default: console.log("No matching module found!"); break;
      }
    }

    console.log(this.calendar,this.bill,this.bet,this.filesharing,this.market);
  }
}
