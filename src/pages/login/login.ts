import { permission } from './../../providers/constants/constants';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, LoadingController, Platform } from 'ionic-angular';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import {JpushProvider} from '../../providers/jpush/jpush';
import { AppVersion } from '@ionic-native/app-version';
import { ENV } from '@app/env';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseUI {
  userList : any[] = [];
  selectedUserId : string;
  password : string;
  hasLogUserList : boolean = true;
  valided : boolean = false;
  versionCode : string;
  Environment : string = ENV.LABEL ;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public network : Network,
              public rest : RestProvider,
              public toastCtrl : ToastController,
              public viewCtrl : ViewController,
              public storage : Storage,
              public loadingCtrl: LoadingController,
              public jpush : JpushProvider,
              public plt : Platform,
              public appVersion: AppVersion) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter(){
    if(this.plt.is('cordova')){
      this.appVersion.getVersionCode().then(p => this.versionCode = p.toString());
    }

    var userId;
    var token;
    var loading =  super.showLoading(this.loadingCtrl,"加载中...");
    Promise.all([this.storage.get("userId"), this.storage.get("token")]).then(values => {
      userId = values[0];
      token = values[1];

      if( userId != null && token !=null){
        if(this.network.type !='none'){
        this.rest.CheckAvailabilityOfToken(token).subscribe(
          (f:any) =>{
            if(f.Success){
              this.navCtrl.setRoot('SettingsPage');
            }
            else{
              super.showToast(this.toastCtrl, "账号密码已过期，请重新登陆");
              this.loadUserList(loading);
            }
          },
          error =>{
            super.showToast(this.toastCtrl, "账号密码已过期，请重新登陆");
            this.storage.remove("userId");
            this.storage.remove("token");
            this.loadUserList(loading);
          }
        )
        }
        else{
          super.showToast(this.toastCtrl, "您处于离线状态，请连接网络!");
        }
      }
      else{
       this.loadUserList(loading);
      }
      
    });
  }

  loadUserList(loading){
    if(this.network.type !='none'){
      Observable.forkJoin([this.rest.GetUserList() , this.rest.GetUnitList()])
      .subscribe( (f : any) => {
        if(f[0].Success&&f[1].Success){
          this.userList = f[0].Data;
          this.storage.set('unitList',JSON.stringify(f[1].Data));
        }else{
          super.showToast(this.toastCtrl, f.Msg);
        }
        if(this.userList.length != 0){
          this.hasLogUserList = false;
        }else{
          super.showToast(this.toastCtrl, "用户名获取失败或单位获取失败");
        }
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        super.showToast(this.toastCtrl, error.Msg);
        //alert(error);//TODO remove
      });
    }
    else{
        super.showToast(this.toastCtrl, "您处于离线状态，请连接网络!");
        loading.dismiss();
    }
  }

  login(){
    if(this.network.type !='none'){
      if(this.selectedUserId!=null && this.password!=null && this.selectedUserId !=''&& this.password !=''){
       var userTosend = this.userList.filter(p=>p.id == this.selectedUserId);
       var user={} ;
       if(userTosend!=null && userTosend[0]!=null){
         user["Password"] = this.password;
         user["Id"] = userTosend[0].id;
         user["Username"] = userTosend[0].username;
         var loading = super.showLoading(this.loadingCtrl,"请稍等");
         this.rest.Login(user) // 填写url的参数
         .subscribe(
         (f : any) => {
           loading.dismiss();
           if(f["Success"]==true){
             if(this.plt.is("cordova")){
              this.jpush.initJpush();
              var tags = [userTosend[0].id];
              for (let index = 0; index < f["Data"].permission.length; index++){
                tags.push(f["Data"].permission[index]['permissionCode']);
              }
              this.jpush.setTags(tags);
              console.log('already login');
              this.jpush.getAllTags();
             }
            // clean all data before insert
            this.storage.clear();
            this.storage.set('userList',JSON.stringify(this.userList));
            this.storage.set("userId",userTosend[0].id);
            this.storage.set("username",userTosend[0].username);
            this.storage.set("token",f["Data"].token);
            this.storage.set("permission",JSON.stringify(f["Data"].permission));

            var pemisson = f["Data"].permission.find( i => i.permissionCode == 'OrderModule_financialValidation' || i.permissionCode == 'OrderModule_managerValidation')
            if(pemisson==null){
              document.getElementById('审核销售/采购订单').style.display = 'none';
            }
          
            if(f["Data"].entrepriseType!=null){
              this.storage.set("entrepriseType",f["Data"].entrepriseType);
            }
            if(f["Data"].accountInfo!=null){
              f["Data"].accountInfo.entrepriseFax!=null? this.storage.set("fax",f["Data"].accountInfo.entrepriseFax):null;
              f["Data"].accountInfo.entrepriseTel!=null? this.storage.set("telephone",f["Data"].accountInfo.entrepriseTel): null;
              f["Data"].accountInfo.entrepriseName!=null? this.storage.set("entrepriseName",f["Data"].accountInfo.entrepriseName): null;
            }
            this.navCtrl.setRoot('SettingsPage');
           }
           else{
             super.showToast(this.toastCtrl,"登录失败，请检查用户名与密码是否正确");
           }
         },
         error => {
          super.showToast(this.toastCtrl, error.Msg);
         });
        }
        else{
          super.showToast(this.toastCtrl,"请输入正确的账号及密码");
        }
       }
    }
    else{
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络!");
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
