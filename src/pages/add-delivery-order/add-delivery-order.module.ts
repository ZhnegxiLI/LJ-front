import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDeliveryOrderPage } from './add-delivery-order';

@NgModule({
  declarations: [
    AddDeliveryOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDeliveryOrderPage),
  ],
})
export class AddDeliveryOrderPageModule {}
