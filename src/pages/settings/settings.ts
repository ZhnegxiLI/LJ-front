import { JpushProvider } from './../../providers/jpush/jpush';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
adminPermission:boolean = false;
username : string;
financialPermission:boolean = false;
managerPermission:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage :Storage,public jpush : JpushProvider,public plt : Platform) {
  }

  ionViewDidLoad() {
    this.storage.get('username').then(p=>this.username=p);
    this.storage.get('userId').then(p=>this.adminPermission = p=='Admi'?true:false);
    this.storage.get('permission').then(p=>{
     var permission = JSON.parse(p);

     if(permission!=null && permission.length>0){
      permission.forEach(val => {
        if(val.permissionCode== 'OrderModule_financialValidation'){
          this.financialPermission =true;
        }
        if(val.permissionCode== 'OrderModule_managerValidation'){
          this.managerPermission = true;
        }
      });
     }
    });
  }
  logout(){
    Promise.all([this.storage.remove("userId"),this.storage.remove("token")]).then(values => {
      if(this.plt.is("cordova")){
        this.jpush.cleanTags();
        console.log('already logout');
        this.jpush.getAllTags();
      }
        this.navCtrl.setRoot('LoginPage');
    });
  }
  newFunctionality(){
      this.navCtrl.push('NewFunctionalityPage');
  }
  showSalesOrder(){
    this.navCtrl.push('ReadSalsOrderCategoriesPage',{
      commandTypeLabel:'销售',
      commandTypeId  : 'O'
    });
  }
  showPurcharseOrder(){
    this.navCtrl.push('ReadSalsOrderCategoriesPage',{
      commandTypeLabel:'采购',
      commandTypeId  : 'I'
    });
  }
  editOrder(){
    this.navCtrl.push('SalsOrderPage');
  }
  valideOrder(){
    this.navCtrl.push('ValidationOrderListPage');
  }

  myInfo(){
    this.navCtrl.push('MyInfoPage');
  }
  setPermission(){
    this.navCtrl.push('SetPermissionPage');
  }
  viewCommandWithFilterPage(){
    this.navCtrl.push('ViewCommandWithFilterPage');
  }
}
