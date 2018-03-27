import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Circle } from '../declarations/Circle';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  circle_list = ["Circle1", "Circle", "CTest"];

  constructor(public http: HttpClient) {

  }

  public getCirclesByLocation(lat: number, lon: number): Observable<Circle[]> {
    // TODO: add location properties
    return this.http.get<Circle[]>(`http://localhost:8080/circle/forLocation`);
  }

  public getCircles() {
    if (this.circle_list == null) {
      return [];
    }
    else {
      return this.circle_list;
    }
  }

  public setLocation(lat, long) {
    //Jesse mach mal was
  }

}
