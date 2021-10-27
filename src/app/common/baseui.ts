import { Loading, LoadingController, ToastController, Toast, NavController } from "ionic-angular";

export abstract class BaseUI{
    constructor(){

    }
    protected showLoading (loadingCtrl: LoadingController, message :string ):Loading{
        let loader = loadingCtrl.create(
            {
                content: message,
                dismissOnPageChange: true
            }
        );
        loader.present();
        return loader ;
    }

    protected showToast(toastCtrl: ToastController, message: string):Toast{
        let toast = toastCtrl.create({
            message:message,
            duration : 2000,
            position:'bottom'
        });
        toast.present();
        return toast;
    }
    protected logout(toastCtrl: ToastController, navCtrl: NavController){
        this.showToast(toastCtrl,"登录已过期，请重新登陆");
        navCtrl.setRoot('LoginPage');
    }
    protected showAlert(alertCtrl,title,message, callback, callbackReturn){
        let confirm = alertCtrl.create({
            title: title,
            message: message,
            buttons: [
              {
                text: '确认',
                handler:()=>{callback} 
              },
              {
                text: '取消',
                handler: callbackReturn
              }
            ]
          });
          confirm.present();
    }
} 
