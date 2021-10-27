import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadDeliveryOrderPage } from './read-delivery-order';

@NgModule({
  declarations: [
    ReadDeliveryOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadDeliveryOrderPage),
  ],
})
export class ReadDeliveryOrderPageModule {}
