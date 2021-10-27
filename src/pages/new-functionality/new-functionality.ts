import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-new-functionality',
  templateUrl: 'new-functionality.html',
})
export class NewFunctionalityPage {
  public versionNumber: string;
  public versionCode: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appVersion: AppVersion,
    public plt: Platform) {
  }

  ionViewDidLoad() {
    if(this.plt.is('cordova')){
      this.appVersion.getVersionCode().then(p => this.versionCode = p.toString());
      this.appVersion.getVersionNumber().then(p => this.versionNumber = p);
    }
  }

}
