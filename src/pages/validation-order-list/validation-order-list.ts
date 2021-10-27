import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the ValidationOrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-validation-order-list',
  templateUrl: 'validation-order-list.html',
})
export class ValidationOrderListPage extends BaseUI {
  List:Array<any>= [];
  noData:boolean = false;
  constructor(public toastCtrl:ToastController,public network: Network ,public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    super();
  }

  ionViewDidLoad() {
    if (this.network.type != 'none') {
      this.rest.GetSalesOrderValidationList(null,'')
        .subscribe(
          f => {
            if (f.Success) {
              var validationList = f.Data.filter(p=> {  
                return p.statusId==1 ||p.statusId==3 
              });
              validationList.map(p=>p.labelColor=(p.commandeTypeId=='I'?'primary':'secondary'));
              this.List = validationList;
              this.noData = this.List.length<=0? true : false;
            } else {
              super.showToast(this.toastCtrl, f.Msg);
            }
          },
          error => {
            if (error.Type == '401') {
              super.logout(this.toastCtrl, this.navCtrl);
            } else {
              super.showToast(this.toastCtrl, error.Msg);
            }
          });
    }
    else {
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! ");
    }
  }
  showCommandDetail(infoOrder){
    this.navCtrl.push('SalsOrderPage',{title : infoOrder.commandeId});
  }
  
  doRefresh(refresher){
      this.rest.GetSalesOrderValidationList(null,'')
      .subscribe(
        (f : any) => {
          if (f.Success) {
            var validationList = f.Data.filter(p=> {  
              return p.statusId==1 ||p.statusId==3 
            });
            validationList.map(p=>p.labelColor=(p.commandeTypeId=='I'?'primary':'secondary'));
            this.List = validationList;
          } else {
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
  }
  
}
