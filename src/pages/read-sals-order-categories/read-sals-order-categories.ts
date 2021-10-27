import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController, NavParams, LoadingController } from 'ionic-angular';
import { RestProvider} from '../../providers/rest/rest';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ReadSalsOrderCategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-read-sals-order-categories',
  templateUrl: 'read-sals-order-categories.html',
})
export class ReadSalsOrderCategoriesPage extends BaseUI {
  orderStatus: any[];
  loading : boolean = true;
  noData : boolean = false;
  commandTypeId: string;
  commandTypeLabel: string;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      public network : Network ,
      public rest : RestProvider,
      public toastCtrl : ToastController,
      public loadingCtrl : LoadingController,
      public storage : Storage) {
      super();
     // this.initSalsOrdersCategoryData();
  }

  ionViewDidLoad() {
   // this.orderStatus = ["未提交","提交到财务","财务不同意","财务同意","经理不同意","经理同意","已作废","冲单"];
    if(this.network.type !='none'){
      this.initSalsOrdersCategoryData();
      this.commandTypeId = this.navParams.get('commandTypeId');
      this.commandTypeLabel = this.navParams.get('commandTypeLabel');
    }else{
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! "); 
    }
  }

  initSalsOrdersCategoryData(){
   
    this.storage.get("userId").then(userId =>{
 
      this.rest.GetSalesOrderCategoriesByUserId(userId,this.commandTypeId)
      .subscribe(
        (f : any) => {
          if(f.Success){
            this.loading = false;
            if(f["Data"].length>0){
                this.noData = false;
                this.orderStatus = f["Data"];
            }
            else{
              this.noData = true;
            }
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
        });
    });
  }

  itemSelected(itemId){
    if(itemId!=null){
      this.navCtrl.push('ReadSalsOrderPage',{commandTypeId:this.commandTypeId ,cateogryId:itemId, commandTypeLabel:this.commandTypeLabel});
    }
  }
  doRefresh(refresher){
    this.storage.get("userId").then(userId =>{
 
      this.rest.GetSalesOrderCategoriesByUserId(userId,this.commandTypeId)
      .subscribe(
        (f : any) => {
          if(f.Success){
            this.loading = false;
            if(f["Data"].length>0){
                this.noData = false;
                this.orderStatus = f["Data"];
            }
            else{
              this.noData = true;
            }
          }else{
            super.showToast(this.toastCtrl, f.Msg);
          }
        refresher.complete();
        },
        error => {
          if(error.Type =='401'){
            super.logout(this.toastCtrl,this.navCtrl);
          }else{
            super.showToast(this.toastCtrl, error.Msg);
          } 
      refresher.complete();
        });
    });
  }

}
