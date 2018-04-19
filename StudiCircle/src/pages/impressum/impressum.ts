import {Component} from '@angular/core';
import {SettingsPage} from "../settings/settings";
import {AlertController, NavController} from "ionic-angular";
import {ToastyProvider} from "../../providers/toasty/toasty";
import { LogInPage } from '../log-in/log-in';

@Component({
  selector: 'page-impressum',
  templateUrl: 'impressum.html'
})
export class ImpressumPage {

 
  constructor(public navCtrl: NavController, private toasty : ToastyProvider, private alertCtrl : AlertController) {

  }



  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(LogInPage);
  }

}
