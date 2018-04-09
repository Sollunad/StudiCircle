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

  constructor(public http: HttpClient, private api: ApiProvider, public consts: constants) { }

  public getCircles(): Observable<Circle[]> {
      return this.http.get<Circle[]>(this.consts.url+'circle/forUser?mySession=' + this.api.currentUser.session);
  }

  public getCirclesByLocation(lat: number, lon: number, distance: number): Observable<Circle[]> {
    console.log('getCirclesByLocation', lat, lon, distance);

    const url = this.consts.url+`circle/forLocation?loc[lat]=${lat}&loc[lon]=${lon}&dist=${distance}`;
    return this.http.get<Circle[]>(url);
  }

  public getLocationByAddress(address: string): Observable<GeoResponse> {
    const url = `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`;
    return this.http.get<GeoResponse>(url);
  }

  public getBlackboardPosts(circleId: number): Observable<BlackboardPost[]>{
    // console.log('getBlackboardPosts', circleId);

    // const url = this.consts.url+`circle/blackboard/posts/${circleId}`;
    const url = `http://localhost:8080/circle/blackboard/posts?id=${circleId}`;
    return this.http.get<BlackboardPost[]>(url);
  }

  public insertPost(circleId: number, text: string): Observable<String> {
    console.log('insertPost', circleId, text);

    // TODO: what's going here???

    // const url = this.consts.url+`circle/blackboard/posts/newPost`;
    const url = 'http://localhost:8080/circle/blackboard/newPost';
    return this.http.post<String>(url, {
      circleId: circleId,
      userId: this.api.currentUser.uuid,
      text: text
    });
  }

  public deletePost(postID: number){
    //const url = this.const.url+"circle/blackboard/deletePost"+postID;
    //return this.http.post(url, {postID: postID});
    return 1;
  }
}
