import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import {CircleStartseite} from '../circle-startseite/circle-startseite';
import {Geolocation} from '@ionic-native/geolocation';
import {HttpClient} from "@angular/common/http";
import {CircleProvider} from '../../providers/circle-provider/CircleProvider';
import {Circle} from '../../providers/declarations/Circle';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public search: '';
  public distance: 0;
  public circles: Array<Circle>;
  private nonFilteredCircles = Array<Circle>();

  private distances = [
    { label: '1', value: 1 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '∞', value: -1 }
  ];
  private lat: number;
  private lon: number;
  private userId: number;

  constructor(public navCtrl: NavController, public http: HttpClient, private circleProvider: CircleProvider) {
    this.distance = 0;

    this.getUserData();
    this.getCirclesByLocation();
  }

  private getUserData() {
    // TODO:

    this.lat = 0;
    this.lon = 0;
    this.userId = 1;
  }

  private getCirclesByLocation() {
    const dist = this.distances[this.distance].value;
    this.circleProvider.getCirclesByLocation(this.lat, this.lon, dist).subscribe(
      circles => {
        console.log('getCirclesByLocation', circles);
        this.circles = this.nonFilteredCircles = circles;
      });
  }

  private distanceChanged() {
    // console.log(this.distance);
    document.getElementById('search-distance').innerText = this.distances[this.distance].label;

    this.search = '';
    this.getCirclesByLocation();
  }

  private searchCircles() {
    let value = this.search.trim().toLowerCase();

    if (value && value != '') {
      console.log('value', value);
      this.circles = this.nonFilteredCircles.filter(circle => circle.name.toLowerCase().startsWith(value));
    } else {
      console.log('value', 'empty');
      this.circles = this.nonFilteredCircles;
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
    console.log(circle);

    this.circleProvider.addUserToCircle(this.userId, circle.id).subscribe(
      result => {
        console.log('joinCircle', result);
      });
  }

  private goToSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
