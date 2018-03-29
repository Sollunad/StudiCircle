import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import {CircleStartseite} from '../circle-startseite/circle-startseite';
import {Geolocation} from '@ionic-native/geolocation';
import {HttpClient} from "@angular/common/http";
import {DbProvider} from '../../providers/dbprovider/dbprovider';
import {Circle} from '../../providers/declarations/Circle';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public search: '';
  public distance: 0;
  public circles: Array<Circle>;

  private distances = [
    { label: '1', value: 1 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '∞', value: 1 }
  ];
  private lat: number;
  private lon: number;

  constructor(public navCtrl: NavController, private geo: Geolocation, private alertCtrl: AlertController, public http: HttpClient, private dbProvider: DbProvider) {
    this.getCurrentPosition();
  }

  private getCirclesByLocation() {
    const dist = this.distances[this.distance].value;
    this.dbProvider.getCirclesByLocation(this.lat, this.lon, dist).subscribe(
      circles => {
        console.log('getCirclesByLocation', circles)
        this.circles = circles;
      });
  }

  private distanceChanged() {
    // console.log(this.distance);

    document.getElementById('search-distance').innerText = this.distances[this.distance].label;

    this.getCirclesByLocation();
  }

  private circleClicked(circle: Circle) {
    console.log(circle);

    this.navCtrl.push(CircleStartseite, {
      circleId: circle.id,
      circleName: circle.name
    });
  }

  private searchCircles() {
    let value = this.search.trim();

    if (value && value != '') {
      console.log('value', value);

      // TODO: filter circles by name
    } else {
      console.log('value', 'empty');
      // TODO: view all circles
    }
  }

  private getCurrentPosition() {
    this.geo.getCurrentPosition().then((position) => {
      // console.log('position', position);
      let coords = position.coords;

      this.setUserCoordinates(coords.latitude, coords.longitude)
    }, (err) => {
      // console.log('error', err);

      this.showLocationPrompt();
    });
  }

  private setUserCoordinates(lat: number, lon: number) {
    this.lat = lat;
    this.lon = lon;
    this.distance = 0;
    document.getElementById('search-location').innerText = ` @ ${lat}, ${lon}`;

    this.getCirclesByLocation();
  }

  private showLocationPrompt() {
    this.alertCtrl.create({
      title: 'Location',
      message: 'Enter your location',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'location',
          placeholder: 'Location'
        },
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            // console.log('data', data);
            let address = data.location;

            this.getLocationByAddress(address);
          }
        }
      ]
    }).present();
  }

  private getLocationByAddress(address: string) {
    this.http
      .get(`https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`)
      .subscribe(data => {
        let json = data[0];
        // console.log('json', json);

        if (json === undefined) {
          this.showLocationPrompt();
        } else {
          this.setUserCoordinates(json.lat, json.lon);
        }
      });
  }

  private goToSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
