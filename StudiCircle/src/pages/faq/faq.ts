import {Component} from '@angular/core';
import {SettingsPage} from "../settings/settings";
import {NavController} from "ionic-angular";
import {ToastyProvider} from "../../providers/toasty/toasty";

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html'
})
export class FAQPage {

  public articles = ['Article 1', 'Article 2', 'Article 3', 'Article 4', 'Article 5', 'Article 6', 'Article 7', 'Article 8'];

  constructor(public navCtrl: NavController, private toasty : ToastyProvider) {

  }

  articlePressed(article : string){
    console.log("[FAQ] : " + article + " clicked");
    this.toasty.toast('Currently there is no ' + article);
  }

  private goToSettings(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingsPage);
  }

}
