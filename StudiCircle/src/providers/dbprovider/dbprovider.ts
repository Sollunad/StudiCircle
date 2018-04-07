import {HttpClient} from '@angular/common/http';
import {ApiProvider} from '../api/api';
import {Injectable} from '@angular/core';
import {GeoResponse} from "../declarations/GeoResponse";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Circle} from '../declarations/Circle';
import {BlackboardPost} from "../declarations/BlackboardPost";
import {constants} from "../../consts/constants";

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  private result: any;
  private circles: Circle[] = [];
  private psot = new Array<BlackboardPost>();

  constructor(public http: HttpClient, private api: ApiProvider, public consts: constants) { }

  public getCircles(): Observable<Circle[]> {
      return this.http.get<Circle[]>(this.consts.url+'circle/forUser?mySession=' + this.api.currentUser.session);
    /*this.http.get('https/api.dev.sknx.de/circle/forUser?id=1').map(res => {
       this.res = res;
       console.log(res);
     });*/
     /*return new Promise<Array<string>>((resolve, reject) => {
       const successSubject: Subject<boolean> = new Subject<boolean>();
       const subs: Subscription = this.http.get(
         'http://localhost:8080/circle/forUser'+'?mySession='+this.api.currentUser.session).subscribe(
         (res: ApiResponse) => {
           subs.unsubscribe();
           successSubject.next(res.httpStatus === 200);
           this.circles = [];
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
     });*/
  }

  public getCirclesByLocation(lat: number, lon: number, distance: number): Observable<Circle[]> {
    console.log('getCirclesByLocation', lat, lon, distance);

    const url = this.consts.url+`circle/forLocation?loc[lat]=${lat}&loc[lon]=${lon}&dist=${distance}`;
    return this.http.get<Circle[]>(url);
  }

  public setLocation(lat, lon) {
    console.log('setLocation', lat, lon);
  }


  public getLocationByAddress(address: string): Observable<GeoResponse> {
    const url = `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`;
    return this.http.get<GeoResponse>(url);
  }

  private count = 1; // WIEDER RAUSNEHMEN!!!!
  public getBlackboardPosts(circleId: number){
    //Code
    if(this.count != 0){
        this.psot.push({postID: 1, userName: "TestUser", text: "Toller Post", date: "20170406", comments: [{postID: 1, userName: "TestUser", text: "Toller Post", date: "20170406"}]},
                       {postID: 2, userName: "TestUser2", text: "Test", date: "20170406", comments: [{postID: 1, userName: "TestUser", text: "Toller Post", date: "20170406"}]});
        this.count = this.count -1;
    }
    return this.psot;
    //return posots;
  }

  public deletePost(postID: number){
    //const url = this.const.url+"circle/blackboard/deletePost"+postID;
    //return this.http.post(url, {postID: postID});
    return 1;
  }
}
