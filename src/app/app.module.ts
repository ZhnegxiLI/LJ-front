import { JpushProvider } from './../providers/jpush/jpush';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from '@angular/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RestProvider } from '../providers/rest/rest';
import { AppVersion } from '@ionic-native/app-version';
import { JPush } from 'ionic3-jpush';

import {CodePush} from "@ionic-native/code-push";

import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { UtilsProvider } from '../providers/utils/utils';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicSelectableModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CodePush,
    JPush,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    JpushProvider,
    RestProvider,
    Network,
    AppVersion,
    MobileAccessibility,
    UtilsProvider
  ]
})
export class AppModule {}
