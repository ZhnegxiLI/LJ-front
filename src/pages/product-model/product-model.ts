import { unitConvert } from './../../providers/constants/constants';
import { Component } from '@angular/core';
import { IonicPage, AlertController, NavParams,ViewController,ToastController, NavController, List} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RestProvider} from '../../providers/rest/rest';
import { BaseUI } from '../../app/common/baseui';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ProductModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-product-model',
  templateUrl: 'product-model.html',
})
export class ProductModelPage extends BaseUI {

  searchQuery: string = '';
  products: any;
  gridShow = false;
  productNotFound = false;
  private productForm : FormGroup;
  modifMod = false;
  productSelect : any;
  hadSubmit = false;
  unitList:Array<any> = unitConvert;

  constructor(public viewCtrl: ViewController, 
    private formBuilder: FormBuilder, 
    public navParams: NavParams, 
    public navCtrl:NavController,
    public rest: RestProvider,
    public alerCtrl: AlertController,
    public toastCtrl : ToastController,
    public network: Network,
    public storage: Storage) {
    super();
    
    
    this.productForm = this.formBuilder.group({
      idProduct: [''],
      nameProduct: ['', Validators.required],
      adresseProduct: [''],
      nameOffical: [''],
      numberProduct: ['', Validators.required],
      unitProduct: ['', Validators.required],
      priceProduct: ['', Validators.required],
      datePayProduct:['',Validators.required],
      hadPaidProduct:[''],
      descriptProduct:[''],
      unitPriceType:['1'],
      totalPrice:['',Validators.required],
      equivalenceValue:[1]
    });

    this.products = [];

    let infoProduct = this.navParams.get('infoProduct');
    if(infoProduct != undefined){
      this.productForm.setValue(infoProduct);
      this.productSelect = {
        id:infoProduct.idProduct,
        name:infoProduct.nameProduct,
        unit:infoProduct.unitProduct
      };
      this.modifMod = true;
    }
  }

  checkNumber(name:string){
     let val =  this.productForm.value[name];
     if(isNaN(Number.parseInt(val))){
      this.productForm.controls[name].setValue('');
     }
  }

  fixeNumber(name:string){
    var val = this.productForm.value[name];
    this.productForm.controls[name].setValue(Number(val).toFixed(2));
  }

  initProducts(){
      if(this.network.type !='none'){
        this.rest.GetCargoByName(-1) // 填写url的参数
              .subscribe(
              (f : any) => {
                if(f.Success){
                  this.products = f.Data;
                  this.storage.set('productList',JSON.stringify(f.Data));
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
      }
      else{
        super.showToast(this.toastCtrl, "您处于离线状态，请连接网络! "); 
      }
  }

  changeUnitPriceType(){
    if(this.productForm.value['unitPriceType'] == '1'){
      console.log(this.productForm.value['unitProduct']);
      var temp = this.unitList.find(u => u.label == this.productForm.value['unitProduct']);
      if(temp){
        if(temp.equivalence){
          this.productForm.get('equivalenceValue').setValue(temp.equivalence);
        }
      }else{
        this.productForm.get('equivalenceValue').setValue(1);
      }
      
    }else if(this.productForm.value['unitPriceType'] == '2'){
      this.productForm.get('equivalenceValue').setValue(1);
    }
  }

  changeTotalPrice(){
    this.productForm.get('totalPrice').setValue(
      (this.productForm.value.priceProduct *  this.productForm.value.numberProduct * this.productForm.value.equivalenceValue).toFixed(2)
      );
  }

  changeProduct(){
    let productTmp = this.productForm.value;
      productTmp["idProduct"] = this.productSelect.id;
      productTmp["nameProduct"] = this.productSelect.name;
      productTmp["unitProduct"] = this.productSelect.unit;
      this.productForm.setValue(productTmp);
  }


  exit() {
    this.viewCtrl.dismiss();
  }

  logProductForm() {
    console.log(this.productForm.value);
    this.viewCtrl.dismiss({action : 1, content : this.productForm.value});
  }

  removeProduct(){
    let confirm = this.alerCtrl.create({
      title: '提示',
      message: '确认删除此商品吗?',
      buttons: [
        {
          text: '确认',
          handler: () => {
            this.viewCtrl.dismiss({action : 0, content : {}});
          }
        },
        {
          text: '取消',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductModelPage');
    let tempHadSubmit = this.navParams.get('hadSubmit');
    if(tempHadSubmit != undefined) this.hadSubmit = tempHadSubmit;
    if(!this.hadSubmit) {
      this.storage.get('productList').then(p=>{
        if(JSON.parse(p)!=null&&JSON.parse(p).length>0){
          this.products =JSON.parse(p);
        }
        else{
          this.initProducts();
        }
      });
    }
  }


}
