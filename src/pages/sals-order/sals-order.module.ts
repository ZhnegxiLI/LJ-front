import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalsOrderPage } from './sals-order';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    SalsOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SalsOrderPage),
    IonicSelectableModule
  ],
})
export class SalsOrderPageModule {}
