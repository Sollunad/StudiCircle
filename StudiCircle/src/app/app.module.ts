import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { GetInvolvedPage } from '../pages/get-involved/get-involved';
import { LogInPage } from '../pages/log-in/log-in';
import { VerifyNowPage } from '../pages/verify-now/verify-now';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { CircleErstellenPage} from '../pages/circle-erstellen/circle-erstellen';
import { SettingsPage } from '../pages/settings/settings';
import { PassManPage } from '../pages/pass-man/pass-man';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';

import {CircleProvider} from "../providers/circle-provider/CircleProvider";
import { Geolocation } from '@ionic-native/geolocation';
import { DbProvider } from '../providers/dbprovider/dbprovider';
import {SearchPage} from "../pages/search/search";
import {CircleEinstellungenPage} from "../pages/circle-einstellungen/circle-einstellungen";
import {CircleStartseite} from "../pages/circle-startseite/circle-startseite";
import {MitgliederÜbersicht} from "../pages/mitglieder-übersicht/mitglieder-übersicht";

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import {ChatPage} from "../pages/chat/chat";
const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    MyApp,
    GetInvolvedPage,
    LogInPage,
    VerifyNowPage,
    DashboardPage,
    CircleErstellenPage,
    SettingsPage,
    SearchPage,
    PassManPage,
    CircleStartseite,
    CircleEinstellungenPage,
    MitgliederÜbersicht,
    ChatPage
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetInvolvedPage,
    LogInPage,
    VerifyNowPage,
    DashboardPage,
    CircleErstellenPage,
    SettingsPage,
    SearchPage,
    PassManPage,
    CircleStartseite,
    CircleEinstellungenPage,
    MitgliederÜbersicht,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiProvider,
    CircleProvider,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    DbProvider,
    HttpClientModule
  ]
})
export class AppModule {}
