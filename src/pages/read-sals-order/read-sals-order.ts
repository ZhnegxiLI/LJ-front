import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, Toast} from 'ionic-angular';
import { SalsOrderPage } from '../sals-order/sals-order'; 
import { RestProvider} from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the ReadSqlsOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-read-sals-order',
  templateUrl: 'read-sals-order.html',
})
export class ReadSalsOrderPage extends BaseUI{

  private step:number = 7;
  private counter:number = 0;
  private salsOrders : Array<any>;
  private userId : string;
  private hasChangeData = false;
  CategoryId : string;
  CommandTypeId : string;
  commandTypeLabel : string;
  labelColor: string;
  loading : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public rest: RestProvider,
    public storage : Storage,
    public toastCtrl : ToastController,
    public network: Network) {
      super();
      this.CategoryId = this.navParams.get('cateogryId');
      this.CommandTypeId = this.navParams.get('commandTypeId');
      this.commandTypeLabel = this.navParams.get('commandTypeLabel');
      this.labelColor= this.CommandTypeId=='O'? 'primary':'secondary';
      this.initSalsOrdersData();
  }

  initSalsOrdersData(){
    this.storage.get("userId").then((val) => {
      this.userId = val;
      this.loading = true;
      if(this.network.type !='none'){
        
        this.rest.GetOrdersByUserId(this.userId,this.CategoryId, this.CommandTypeId,this.step,this.counter) //TODO: change
            .subscribe(
              (f : any) => {     
                if(f.Success){
                  this.salsOrders = f["Data"].data!=null?f["Data"].data:[];
                }else{
                  super.showToast(this.toastCtrl, f.Msg);
                }
                this.loading = false;
              },
              error => {
                if(error.Type =='401'){
                  super.logout(this.toastCtrl,this.navCtrl);
                }else{
                  super.showToast(this.toastCtrl, error.Msg);
                }
                this.loading = false;
              }
            );
      }
      else{
        super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! "); 
      }
    }
  );
  }

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
        this.hasChangeData = _params;
        resolve();
    });
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReadSalsOrderPage');
  }

  ionViewDidEnter(){
   if(this.hasChangeData){
     this.initSalsOrdersData();
   }
  }

  presentOrderPage(infoOrder, index:number){
    this.navCtrl.push('SalsOrderPage',{title : infoOrder.commandeId,callback:this.myCallbackFunction});
  }

  doInfinite(infiniteScroll){
    console.log(infiniteScroll);
    this.storage.get("userId").then((val) => {
      this.userId = val;
      if(this.network.type !='none'){
        this.counter= this.counter+1;
        this.rest.GetOrdersByUserId(this.userId,this.CategoryId, this.CommandTypeId,this.step,this.counter) //TODO: change
            .subscribe(
              (f : any) => {     
                if(f.Success){
                  if (f["Data"].totalCount <= this.step*this.counter) {
                    infiniteScroll.enable(false);   //没有数据的时候隐藏 ion-infinate-scroll
                  }
                  else{
                    this.salsOrders= this.salsOrders.concat(f["Data"].data!=null ?f["Data"].data:[]);
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
  );
}  


}
