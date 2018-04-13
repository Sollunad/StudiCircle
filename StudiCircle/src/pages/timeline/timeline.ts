import {Component} from "@angular/core";
import {PopoverController} from "ionic-angular";
import {PopoverTimelinePage} from "../popover-timeline/popover-timeline";

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {

  constructor(private popoverCtrl: PopoverController) {

  }

  presentPopover(event) {

    let popover = this.popoverCtrl.create(PopoverTimelinePage);

    popover.present({
      ev: event
    });
  }

}
