import {Component} from "@angular/core";
import {BlackboardPage} from "../blackboard/blackboard";
import {NavParams} from "ionic-angular";

@Component({
  templateUrl: 'wip.html'
})

export class WipPage {

  moduleName: string;

  constructor(public navParams: NavParams) {
    this.moduleName = navParams.get('moduleName');
  }
}
