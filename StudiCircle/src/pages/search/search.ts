import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import {CircleStartseite} from '../circle-startseite/circle-startseite';
import {HttpClient} from "@angular/common/http";
import {CircleProvider} from '../../providers/circle-provider/CircleProvider';
import {ApiProvider} from '../../providers/api/api';
import {Circle} from '../../providers/declarations/Circle';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public search: string = '';
  public distance: number = 0;
  public distanceLabel: string = '1';
  public circles: Array<Circle>;
  public count: number = 0;

  private distances = [
    { label: '1', value: 1 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '∞', value: -1 }
  ];
  private nonFilteredCircles = Array<Circle>();
  private lat: number;
  private lon: number;

  constructor(public navCtrl: NavController, public http: HttpClient, private circleProvider: CircleProvider, private api: ApiProvider) {
    this.getUserData();
    this.getCirclesByLocation();
  }

  private getUserData() {
    const coords = this.api.getLocation();
    this.lat = coords.lat;
    this.lon = coords.lon;
  }

  private setCircles(circles: Circle[]) {
    this.count = circles.length;
    this.circles = circles;
  }

  private getCirclesByLocation() {
    const dist = this.distances[this.distance].value;
    this.circleProvider.getCirclesByLocation(this.lat, this.lon, dist).subscribe(
      circles => {
        // console.log('getCirclesByLocation', circles);
        this.nonFilteredCircles = circles;
        this.setCircles(circles);
      });
  }

  private distanceChanged() {
    this.distanceLabel = this.distances[this.distance].label;
    this.search = '';
    this.getCirclesByLocation();
  }

  private searchCircles() {
    let value = this.search.trim().toLowerCase();

    if (value && value != '') {
      // console.log('value', value);
      this.setCircles(
        this.nonFilteredCircles.filter(circle => circle.name.toLowerCase().startsWith(value))
      );
    } else {
      // console.log('value', 'empty');
      this.setCircles(this.nonFilteredCircles);
    }
  }

  private circleClicked(circle: Circle) {
    console.log(circle);

    this.navCtrl.push(CircleStartseite, {
      circleId: circle.id,
      circleName: circle.name
    });
  }

  private joinCircle(circle: Circle) {
    console.log('joinCircle', circle);

    this.circleProvider.addUserToCircle(circle.id).subscribe(
      result => {
        console.log('joinCircle', result);
      });
  }

  private goToSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
