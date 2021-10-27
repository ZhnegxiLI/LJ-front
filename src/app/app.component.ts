import { permission } from './../providers/constants/constants';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush, InstallMode } from '@ionic-native/code-push';
import { RestProvider } from '../providers/rest/rest'
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{ 
    title : string,
    type : string ,
    icon : string,
    singleComponent : {component: string, param: object},
    multComponent : any }> = []; 
    //Array<{title: string, componentPages: Array<{pageTitle: string, component: any}>}>;

  listShow: { [key: string]: boolean } = {};

  constructor(public rest: RestProvider,
    public loadingCtrl: LoadingController, 
    public codePush: CodePush, 
    public platform: Platform, 
    public statusBar: StatusBar, 
    public plt : Platform,
    public splashScreen: SplashScreen,
    public mobileAccessibility: MobileAccessibility,
    public storage : Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.initMultMenu('采购订单', 'document');
    this.addMultMenu('采购订单', '编辑销售/采购订单', 'SalsOrderPage',  null);
    this.addMultMenu('采购订单', '查看采购订单', 'ReadSalsOrderCategoriesPage',  { commandTypeId: 'I', commandTypeLabel: '采购' });

    this.initMultMenu('销售订单', 'document');
    this.addMultMenu('销售订单', '编辑销售/采购订单', 'SalsOrderPage',  null);
    this.addMultMenu('销售订单', '查看销售订单', 'ReadSalsOrderCategoriesPage',  { commandTypeId: 'O', commandTypeLabel: '销售' });

    //this.addSingleMenu( '编辑销售/采购订单', 'SalsOrderPage', 'create', null );
    //this.addSingleMenu( '查看销售订单', 'ReadSalsOrderCategoriesPage', 'document', { commandTypeId: 'O', commandTypeLabel: '销售' } );
    //this.addSingleMenu( '查看采购订单', 'ReadSalsOrderCategoriesPage', 'document', { commandTypeId: 'I', commandTypeLabel: '采购' } );
    this.addSingleMenu(  '编辑出货订单',  'AddDeliveryOrderPage', 'create', null );
    this.addSingleMenu( '查看出货订单', 'ReadDeliveryOrderPage', 'document', null );
    this.addSingleMenu( '审核销售/采购订单',  'ValidationOrderListPage',  'arrow-dropdown-circle',  null );
    this.addSingleMenu( '销售排行', 'SalesPerformanceRewardPage',  'star',  null );
    this.addSingleMenu( '我的设置', 'SettingsPage',  'settings',  null );

    for (let index = 0; index < this.pages.length; index++) {
      if(this.pages[index].type == 'mult'){
        this.listShow[this.pages[index].title] = false;
      }
    }

    
  }

  addMultMenu(firstTitle:string, secondTitle : string, component:string, param:any){
    var current = this.pages.filter( item => item.title == firstTitle);
    if(current.length != 0){
      current[0]['multComponent'].push({title:secondTitle, component : component, param : param});
    }else{
      throw "没有初始化二级目录 : " + firstTitle;
    }
  }

  initMultMenu(title : string, icon : string){
    this.pages.push({ 
      title : title,
      type : "mult", 
      icon : icon,
      singleComponent : null,
      multComponent : [] });
  }

  addSingleMenu(title : string, component : string, icon : string, param:any){
    this.pages.push({
      title:title,
      type:'single',
      icon : icon,
      singleComponent : {component : component,  param:param},
      multComponent : null
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
     this.mobileAccessibility.usePreferredTextZoom(false);
     this.statusBar.styleDefault();
     this.splashScreen.hide();
     if(this.plt.is('cordova')){
        this.checkCodePush();
     }
    });
  }

  openPage(component : string, param) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (param == null) {
      this.nav.setRoot(component);
    }
    else {
      this.nav.setRoot(component, param);
    }
  }
  checkCodePush() {
    this.codePush.sync({
      updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix: "\n\n更新说明:\n",
        optionalInstallButtonLabel: "安装",
        optionalIgnoreButtonLabel: "忽略",
        optionalUpdateMessage: "我们发布了一些功能的更新与bug修复",
        updateTitle: "更新"
      },
      installMode: InstallMode.IMMEDIATE
    }, (downloadProgress) => {
      if (downloadProgress) {
        // Update "downloading" modal with current download %
        //alert("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress.totalBytes);
        //console.log(111);
      }
    }).subscribe(
      (data) => {
        if (data == 7) {
        var loading =  this.loadingCtrl.create ({
            content: "正在下载...",
            dismissOnPageChange: true
        });
        loading.present();
        this.storage.clear();
        this.nav.setRoot('LoginPage');
        }
        //0:应用程序是最新的
        //1:*更新是可用的，它已被下载，解压缩并复制到部署文件夹,在使用SycStasUs.UpDeaTyEnter调用回调完成后，应用程序将重新加载更新的代码和资源。
        //2:可选的更新是可用的，但用户拒绝安装它。没有下载更新。
        //3:同步操作期间发生错误。这可能是与服务器通信、下载或解压缩更新时的错误。控制台日志应该包含有关发生的事情的更多信息。在这种情况下没有应用任何更新。
        //4:正在进行中的同步，因此此同步尝试已中止。
        //5:中间状态-插件即将检查更新。
        //6:中间状态-用户对话框即将被显示。只有在启用用户交互时才会报告此状态。
        //7:中间状态-更新包即将被下载。
        //8:中间状态-更新包即将安装。
        // 5678150
        //测试数据
      },
      (err) => {
        console.log('CODE PUSH ERROR: ' + err);
      }
    );
  }
}
