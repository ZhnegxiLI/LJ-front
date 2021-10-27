import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidationOrderListPage } from './validation-order-list';

@NgModule({
  declarations: [
    ValidationOrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(ValidationOrderListPage),
  ],
})
export class ValidationOrderListPageModule {}
