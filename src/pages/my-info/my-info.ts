import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { permission } from '../../providers/constants/constants'
/**
 * Generated class for the MyInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-info',
  templateUrl: 'my-info.html',
})
export class MyInfoPage {
  permissionList= [];
  displayLabel = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage : Storage) {
  }

  ionViewDidLoad() {

    Promise.all([this.storage.get('permission'), this.storage.get('username'),this.storage.get('entrepriseName'),this.storage.get('fax'),this.storage.get('telephone'),this.storage.get('userId')]).then(values => {
      var Permission = JSON.parse(values[0]);
      if(permission!=null && Permission.length>0){
        Permission.forEach(val => {
         if(val.permissionCode== 'OrderModule_financialValidation'){
          this.permissionList.push(permission.financialPermission.label);
         }
         if(val.permissionCode== 'OrderModule_managerValidation'){
          this.permissionList.push(permission.managerPermission.label);
         }
       });
       if(values[5]=='Admi'){
        this.permissionList.push("管理员权限");
       }
      }
      else{
        this.permissionList.push('普通权限');
       }
      var username ="用户名: " + values[1];
      var entrepriseName ="公司名: "+ values[2];
      var fax = "传真: " + values[3];
      var telephone = "电话: " + values[4];
      this.displayLabel = [username,entrepriseName,fax,telephone];
    });
    
  }

}
