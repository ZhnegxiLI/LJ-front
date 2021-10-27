import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidationOrderPage } from './validation-order';

@NgModule({
  declarations: [
    ValidationOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ValidationOrderPage),
  ],
})
export class ValidationOrderPageModule {}
