import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, List, ToastController, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';
import { permission } from '../../providers/constants/constants';

/**
 * Generated class for the SetPermissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-permission',
  templateUrl: 'set-permission.html',
})
export class SetPermissionPage extends BaseUI{
  public userId:string;
  public permissionIds: any=[];
  public userList : any[] = [];
  public permissionList : any[] = [];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public rest: RestProvider,
    public toastCtrl:ToastController,
    public loadingCtrl: LoadingController,
    public network : Network) {
    super();
  }

  ionViewDidLoad() {
    if(this.network.type !='none'){
    this.rest.GetUserList().subscribe(
      (f : any) => {     
        if(f.Success){
          this.userList = f["Data"];
        }else{
          super.showToast(this.toastCtrl, f.Msg);
        }
      },
      error => {
        if(error.Type =='401'){
          super.logout(this.toastCtrl,this.navCtrl);
        }else{
          super.showToast(this.toastCtrl, error.Msg);
        }
      }
    );

    this.rest.GetPermissionList().subscribe(
      (f : any) => {     
        if(f.Success){
          this.permissionList = f["Data"];
        }else{
          super.showToast(this.toastCtrl, f.Msg);
        }
      },
      error => {
        if(error.Type =='401'){
          super.logout(this.toastCtrl,this.navCtrl);
        }else{
          super.showToast(this.toastCtrl, error.Msg);
        }
      }
    );
  }
  else{
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络!");
  }
    console.log('ionViewDidLoad SetPermissionPage');
  }

  savePermission(){
   if(this.userId!=null && this.permissionIds!=null ){
    if(this.network.type !='none'){
      var loading =  super.showLoading(this.loadingCtrl,"保存中...");
      var criteria = {
        userId : this.userId,
        permissionIds : this.permissionIds
      };
      this.rest.SaveUserPermission(criteria).subscribe(
        (f : any) => {     
          if(f.Success){
            super.showToast(this.toastCtrl,"保存成功");
            this.navCtrl.setRoot('SettingsPage');
          }else{
            super.showToast(this.toastCtrl, f.Msg);
          }
          loading.dismiss();
        },
        error => {
          if(error.Type =='401'){
            super.logout(this.toastCtrl,this.navCtrl);
          }else{
            super.showToast(this.toastCtrl, error.Msg);
          }
          loading.dismiss();
        }
      );
      
    }else{
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络!");
    }
   } 
  }

  onChangeUser(){
    if(this.network.type !='none'){
    this.permissionIds = [];
    var loading =  super.showLoading(this.loadingCtrl,"加载中...");
    this.rest.GetUserPermissionById(this.userId).subscribe(
      (f : any) => {     
        if(f.Success){
         var temp = [];
         f.Data.forEach(val => {
          temp.push(val.permissionId); 
          });
          this.permissionIds = temp;
        }else{
          super.showToast(this.toastCtrl, f.Msg);
        }
        loading.dismiss();
      },
      error => {
        if(error.Type =='401'){
          super.logout(this.toastCtrl,this.navCtrl);
        }else{
          super.showToast(this.toastCtrl, error.Msg);
        }
        loading.dismiss();
      }
    );
    }
    else{
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络!");
  }

  }

}
