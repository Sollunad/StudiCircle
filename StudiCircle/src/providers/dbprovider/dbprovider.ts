import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DbproviderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbproviderProvider {

  circle_list = ["Circle1", "Circle", "CTest"];

  constructor(public http: HttpClient) {

  }

  public getCircles(){
    if(this.circle_list == null){
      return -1;
    }
    else{
      return this.circle_list;
    }
  }

  public setLocation(lat, long){
    //Jesse mach mal was
  }

}
