import {HttpClient} from '@angular/common/http';
import {ApiProvider} from '../api/api';
import {Injectable} from '@angular/core';
import {GeoResponse} from "../declarations/GeoResponse";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
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

  public getLocationByAddress(address: string): Observable<GeoResponse> {
    const url = `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`;
    return this.http.get<GeoResponse>(url);
  }

  public getBlackboardPosts(circleId: string){
    //Code
    const url = this.consts.url+'circle/getbbPosts?mySession='+ this.api.currentUser.session+'&circleID='+circleId;
  //  const localurl = 'http://localhost:8080/circle/getbbPosts?mySession=' + this.api.currentUser.session;

    return this.http.get(url);
  }

  public deletePost(postID: number){
    //const url = this.const.url+"circle/blackboard/deletePost"+postID;
    //return this.http.post(url, {postID: postID});
    return 1;
  }

  public postComment(Comment: BlackboardPost){
    const url = this.consts.url + "circle/blackboard/newComment?mySession=" + this.api.currentUser.session;
    return this.http.post(url, {com: Comment});
  }

  public getComments(postID: number){
    const url = this.consts.url + "circle/blackboard/getComments?mySession=" + this.api.currentUser.session + "&postID=" + postID;
    return this.http.get(url);
  }
}
