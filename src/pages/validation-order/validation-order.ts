import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-validation-order',
  templateUrl: 'validation-order.html',
})
export class ValidationOrderPage extends BaseUI {
  commandeId: string;
  validationContent: any;
  validationStaus: number;
  senderDisable: boolean = true;
  financialDisable: boolean = true;
  managerDisable: boolean = true;
  isHidden: boolean = true;
  statusId: string = '1';
  hasFinancialPermission :boolean = false;
  hasManagerPermission :boolean = false;
  public applicationSenderContent: string;
  senderContent: string;
  managerContent: string;
  financialContent: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public rest: RestProvider,
    public network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public alertCtrl: AlertController) {
    super();
  }

  ionViewDidLoad() {
    this.commandeId = this.navParams.get('commandeId');
    this.storage.get('permission').then(p => {
      var permission = JSON.parse(p);
     
      permission.map(p => {
        if (p.permissionCode == 'OrderModule_financialValidation') {
          this.hasFinancialPermission = true;
        }
        if (p.permissionCode == 'OrderModule_managerValidation') {
          this.hasManagerPermission = true;
        }
      });

      this.statusId = this.navParams.get('statusId');
      this.validationStaus = this.navParams.get('validationStaus');// 0:未保存 , 1:已保存未提交, 2:已提交, 3:可审核
      if (this.hasFinancialPermission && this.statusId == '1') {
        this.isHidden = false;
        this.senderDisable = true;
        this.financialDisable = false;
        this.managerDisable = true;
      }
      else if (this.hasManagerPermission && this.statusId == '3') {
        this.isHidden = false;
        this.senderDisable = true;
        this.financialDisable = true;
        this.managerDisable = false;
      }
      else if (this.statusId == '0') {
        this.isHidden = false;
        this.senderDisable = false;
        this.financialDisable = true;
        this.managerDisable = true;

      }

      // switch(this.validationStaus){
      //   case 1: 
      //     this.senderDisable = false;
      //     this.financialDisable = true;
      //     this.managerDisable = true;
      //     break;
      //   case 2 : 
      //     this.senderDisable = true;
      //     this.financialDisable = true;
      //     this.managerDisable = true;
      //     break;
      //   case 3 : 
      //     this.senderDisable = true;
      //     this.financialDisable = false;
      //     this.managerDisable = false;
      //     break;
      //   default :
      //     this.senderDisable = true;
      //     this.financialDisable = true;
      //     this.managerDisable = true;
      //     break;
      // }
      if (this.network.type != 'none') {
        var loading = super.showLoading(this.loadingCtrl, "正在加载，请稍等");
        this.rest.GetSalesOrderValidationContent(this.commandeId).subscribe(
          f => {
            if (f.Success) {
              if (f['Data'] != null && f['Data'] != {}) {
                this.validationContent = f['Data'];
                this.senderContent = this.validationContent.senderContent['content'];
                this.financialContent = this.validationContent.financialContent['content'];
                this.managerContent = this.validationContent.managerContent['content'];
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
          }
        )
      }
      else {
        super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! ");
      }

      this.rest.GetSalesOrderValidationContent(this.commandeId).subscribe()
    });
  }

  valideSalesOrder() {
    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '确认提交此订单吗',
      buttons: [
        {
          text: '确认',
          handler: () => {
            this.saveSalesOrder()
          }
        },
        {
          text: '取消',
          handler: () => { return; }
        }
      ]
    });
    confirm.present();
  }
  saveSalesOrder() {

    if (this.network.type != 'none') {
      var loading = super.showLoading(this.loadingCtrl, "正在提交，请稍等");
      this.storage.get("userId").then(p => {
        var userId = p;
        var submitStatusId;
        var submitContent = "";
        switch (parseInt(this.statusId)) {
          case 0:
            submitStatusId = 1;
            submitContent = this.senderContent;
            break;
          case 1:
            submitStatusId = 3;
            submitContent = this.financialContent;
            break;
          case 3:
            submitStatusId = 5;
            submitContent = this.managerContent;
            break;
          default:
            submitStatusId = this.statusId;
            break;
        }
        this.rest.UpdateSalesOrderStatut(userId, this.commandeId, submitContent, submitStatusId)//1: 提交到财务
          .subscribe(
            f => {
              if (f.Success) {
                super.showToast(this.toastCtrl, "提交成功");
                if(this.hasManagerPermission ||this.hasFinancialPermission ){
                  this.navCtrl.setRoot('ValidationOrderListPage');// TODO： Add into into the validation list
                }
                else{
                  this.navCtrl.setRoot('SettingsPage');
                }
              
              } else {
                super.showToast(this.toastCtrl, "提交失敗 : " + f.Msg);
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
            }
          )
      })
    }
    else {
      super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! ");
    }
  }
}


