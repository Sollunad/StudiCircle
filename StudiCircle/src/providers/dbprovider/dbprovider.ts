import {HttpClient} from '@angular/common/http';
import {ApiProvider} from '../api/api';
import {Injectable} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import {ApiResponse} from "../declarations/ApiResponse";
import {GeoResponse} from "../declarations/GeoResponse";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Circle} from '../declarations/Circle';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  private result: any;
  private circles = new Array();

  constructor(public http: HttpClient, private api: ApiProvider) { }

  public getCircles() {
    /*this.http.get('https/api.dev.sknx.de/circle/forUser?id=1').map(res => {
       this.res = res;
       console.log(res);
     });*/
     return new Promise<Array<string>>((resolve, reject) => {
       const successSubject: Subject<boolean> = new Subject<boolean>();
       const subs: Subscription = this.http.get(
         'http://localhost:8080/circle/forUser?id=1').subscribe(
         (res: ApiResponse) => {
           subs.unsubscribe();
           successSubject.next(res.httpStatus === 200);
           for(let i of res["circles"]){
            this.circles.push(i["name"]);
           }
           resolve(this.circles);
         },
         (error: any) => {
           console.log(error);
           subs.unsubscribe();
           successSubject.next(false);
         }
       );
     });
  }

  public getCirclesByLocation(lat: number, lon: number, distance: number): Observable<Circle[]> {
    console.log('getCirclesByLocation', lat, lon, distance);

    const url = `http://localhost:8080/circle/forLocation?loc[lat]=${lat}&loc[lon]=${lon}&dist=${distance}`;
    return this.http.get<Circle[]>(url);
  }

  public setLocation(lat, lon) {
    console.log('setLocation', lat, lon);
  }

  public getLocationByAddress(address: string): Observable<GeoResponse> {
    const url = `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`;
    return this.http.get<GeoResponse>(url);

    // const successSubject: Subject<boolean> = new Subject<boolean>();
    // const subs: Subscription = this.http.get(
    //   'https://nominatim.openstreetmap.org/search/$' + address + '?format=json&limit=1').subscribe(
    //   (res: GeoResponse) => {
    //     subs.unsubscribe();
    //     console.log(res);
    //     successSubject.next(true);
    //     console.log(res[0].lat, res[0].lon);
    //     this.setLocation(res[0].lat, res[0].lon);
    //   },
    //   (error: any) => {
    //     console.log(error);
    //     subs.unsubscribe();
    //     successSubject.next(false);
    //   }
    //   );
  }
}
