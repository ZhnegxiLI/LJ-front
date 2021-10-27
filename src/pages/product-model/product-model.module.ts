import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductModelPage } from './product-model';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ProductModelPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductModelPage),
    IonicSelectableModule
  ],
})
export class ProductModelPageModule {}
