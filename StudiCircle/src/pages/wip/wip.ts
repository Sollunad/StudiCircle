import {Component} from "@angular/core";
import {BlackboardPage} from "../blackboard/blackboard";
import {ChatPage} from "../chat/chat";

@Component({
  templateUrl: 'wip.html'
})

export class WipPage {

  moduleList: Array<{ title: string, mapName: string, component: any, imageName: string }> = [
    {title: 'Blackboard', mapName: 'blackboard', component: BlackboardPage, imageName: 'blackboard.jpg'}
  ];
  constructor() {

  }
}
