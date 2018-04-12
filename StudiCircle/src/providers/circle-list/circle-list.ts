import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CircleListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CircleListProvider {

  circles = ["Test"];
  constructor(public http: HttpClient) {
  }

  getCircleList(){
    return this.circles;
  }

}
