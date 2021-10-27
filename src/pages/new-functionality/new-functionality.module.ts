import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewFunctionalityPage } from './new-functionality';

@NgModule({
  declarations: [
    NewFunctionalityPage,
  ],
  imports: [
    IonicPageModule.forChild(NewFunctionalityPage),
  ],
})
export class NewFunctionalityPageModule {}
