import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CircleProvider} from "../../providers/circle-provider/CircleProvider";

@Component({
  selector: 'page-circle-erstellen',
  templateUrl: 'circle-erstellen.html'
})
export class CircleErstellenPage {

  private visibility : string = "test";
  private newName : string = "test";

  constructor(public navCtrl: NavController, private _circleService : CircleProvider) {
  }

  vis='1';

  onChange(){
    console.log(this.visibility);
    this.vis = this.visibility;
  }

  createCircle(){
    console.log(this.vis, this.newName);
    const modification = this._circleService.create(this.newName, this.vis).subscribe(
      (success: boolean) => {
        if(success){
          console.log("[CREATE] : Circle created successful");
          modification.unsubscribe();
          return true;
        }else{
          console.log("[CREATE] : Circle created not successful");
          modification.unsubscribe();
          return false;
        }
      }
    )
  }

}
