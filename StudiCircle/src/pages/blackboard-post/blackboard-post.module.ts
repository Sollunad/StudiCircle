import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlackboardPostPage } from './blackboard-post';

@NgModule({
  declarations: [
    BlackboardPostPage,
  ],
  imports: [
    IonicPageModule.forChild(BlackboardPostPage),
  ],
})
export class BlackboardPostPageModule {}
