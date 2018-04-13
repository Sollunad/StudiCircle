import {Component} from '@angular/core';
import {NavParams} from "ionic-angular";


@Component({
  selector: 'popover-timeline',
  templateUrl: 'popover-timeline.html',
})
export class PopoverTimelinePage {
  background: string;
  contentEle: any;
  textEle: any;
  fontFamily;

  constructor(private navParams: NavParams) {

  }
}
