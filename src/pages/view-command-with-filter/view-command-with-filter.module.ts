import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCommandWithFilterPage } from './view-command-with-filter';

@NgModule({
  declarations: [
    ViewCommandWithFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCommandWithFilterPage),
  ],
})
export class ViewCommandWithFilterPageModule {}
