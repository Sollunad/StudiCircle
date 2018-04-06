import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlackboardPage } from './blackboard';

@NgModule({
  declarations: [
    BlackboardPage,
  ],
  imports: [
    IonicPageModule.forChild(BlackboardPage),
  ],
})
export class BlackboardPageModule {}
