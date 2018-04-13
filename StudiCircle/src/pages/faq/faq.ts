import {Component} from '@angular/core';
import {SettingsPage} from "../settings/settings";
import {NavController} from "ionic-angular";
import {ToastyProvider} from "../../providers/toasty/toasty";

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html'
})
export class FAQPage {

  public articles = ['Wie kann ich „nicht-Studenten“ einladen?', 
                    'Damit sich jemand anmelden kann, der keine offizielle E-Mail-Adresse einer Bildungseinrichtung hat, muss die Person über einen Business-Account in einen Circle eingeladen werden. Die für die Einladung angegebene E-Mail-Adresse bekommt anschließend eine Nachricht mit einem Link über den sich auch „nicht-Studenten“ registrieren können.\n', 
                    'Wie lösche ich einen Account und was passiert mit meinen Daten, wenn ich meinen Account lösche?', 
                    'Löschen kann man sein Konto über die „Konto löschen“-Funktion in den Einstellungen. Daraufhin werden bei den getätigten Beiträgen „gelöschter User“ als Benutzer angegeben und die personenbezogenen Daten aus dem System gelöscht.\n',
                    'Welche Daten brauche ich um einen Business-Account registrieren zu können und wie sieht der Prozess aus?',
                    'Der Prozess für die Registrierung eines Business-Accounts unterscheidet sich ein kleines bisschen von einem normalen Account. Nach der Angabe der Kontaktdaten wird man auf der zweiten Seite aufgefordert eine Bezeichnung und Beschreibung der Einrichtung anzugeben. Anschließenden werden diese Daten zur Prüfung weitergegeben und der Account manuell freigegeben.\n',
                    'Was ist der unterscheid zwischen einem „normalen“ Account und einem „Business“-Account?',
                    'Unter normalen Accounts sind die üblichen Accounts von Studenten gemeint. Da wir euch aber auch die Möglichkeit geben wollten innerhalb eure Vereine oder anderen Einrichtungen StudiCircle zu nutzen und dies Leute einschließt, die keine Studenten sind, können sich offizielle Vereinsvertreter Business-Accounts anlegen und über diesen Weg auch „nicht-Studenten“ einladen.\n',
                    'Wer steckt hinter StudiCircle?',
                    'Ganz nach dem Motto „Von Studenten für Studenten“ wurde StudiCircle in Rahmen eines Projektes von einer Gruppe Studenten der Fachrichtung Angewandte Informatik entwickelt.\n',
                    'Wohin kann ich wenden, wenn ich Fragen oder Probleme habe?',
                    'Bei Fragen oder Probleme stehen wir euch unter ________________ zur Verfügung.'];

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
