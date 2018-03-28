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
import {CircleStartseite} from "../pages/circle-startseite/circle-startseite";
import {MitgliederÜbersicht} from "../pages/mitglieder-übersicht/mitglieder-übersicht";
import {CircleProvider} from "../providers/circle-provider/CircleProvider";
import { SearchPage } from '../pages/search/search';
import { Geolocation } from '@ionic-native/geolocation';
import { DbProvider } from '../providers/dbprovider/dbprovider';
import {ForgotPasswordPage} from "../pages/forgot-password/forgot-password";
import {ChangeMailPage} from "../pages/change-mail/change-mail";
import {HttpModule} from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    GetInvolvedPage,
    LogInPage,
    VerifyNowPage,
    DashboardPage,
    CircleErstellenPage,
    SettingsPage,
    PassManPage,
    SearchPage,
    ForgotPasswordPage,
    ChangeMailPage,
    CircleStartseite,
    MitgliederÜbersicht,
    SearchPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
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
    PassManPage,
    SearchPage,
    ChangeMailPage,
    ForgotPasswordPage,
    CircleStartseite,
    MitgliederÜbersicht,
    SearchPage
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
