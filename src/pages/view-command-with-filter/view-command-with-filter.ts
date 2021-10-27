import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-view-command-with-filter',
  templateUrl: 'view-command-with-filter.html',
})
export class ViewCommandWithFilterPage extends BaseUI {
  private filterOrderTypeList: Array<string>;
  private filterOrderStatusList: Array<string>;
  private filterUserList: Array<string>;
  private filterOrderId:string;
  private filterFromDate: Date;
  private filterToDate: Date;

  public orderList : Array<any>;

  private step : number=7;
  private counter: number=0;

  private searchCriteria: any = {};

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public popoverCtrl:PopoverController,
     public toastCtrl: ToastController,
     public loadingCtrl : LoadingController,
     public network: Network,
     public rest : RestProvider,
     public storage: Storage) {
       super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewCommandWithFilterPage');

   
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('FilterPopoverPage', {ViewCommandWithFilterPage: this, searchCriteria:this.searchCriteria} , { cssClass: 'custom-popover'});
    popover.present({
      ev: myEvent
    });
  }

  changeCriteria(criteriaLabel,criteriaValue){
      this.counter = 0;
      this.searchCriteria['begin'] = this.counter;
      this.searchCriteria[criteriaLabel] = criteriaValue;
  }
  resetCriteria(managerPermission){
    this.counter = 0;
    this.searchCriteria['begin'] = this.counter;
    if(managerPermission==true){
      this.searchCriteria = {};
    }
    else{
      this.storage.get('userId').then(p=>{
          this.searchCriteria = { userIds :JSON.parse(p) };
      });
    }

  }
  
  refreshData(){//Array<any>
    if (this.network.type != 'none') {
      var loading = super.showLoading(this.loadingCtrl, "正在获取数据...");
      this.searchCriteria['step'] = this.step;
      this.searchCriteria['begin'] = this.counter;
        this.rest.AdvancedSalesOrderSearch(this.searchCriteria)
          .subscribe(
            f => {
              if (f.Success) {
                if(f.Data!=null&&f.Data.data!=null){
                    this.orderList = f.Data.data;
                }
              }
            loading.dismiss();
          },
            error => {
              loading.dismiss();
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
  viewDetail(item){
    this.navCtrl.push('SalsOrderPage',{title : item});
  }

  doInfinite(infiniteScroll){
    console.log(infiniteScroll);
      if(this.network.type !='none'){
        this.counter= this.counter+1;
        this.searchCriteria['step'] = this.step;
        this.searchCriteria['begin'] = this.counter;
        this.rest.AdvancedSalesOrderSearch(this.searchCriteria) //TODO: change
            .subscribe(
              (f : any) => {     
                if(f.Success){
                  if (f["Data"].totalCount <= this.step*this.counter) {
                    infiniteScroll.enable(false);   //没有数据的时候隐藏 ion-infinate-scroll
                  }
                  else{
                    this.orderList= this.orderList.concat(f["Data"].data!=null ?f["Data"].data:[]);
                    infiniteScroll.complete(); 
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
              }
            );
      }
      else{
        super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! "); 
      }
}  

}
