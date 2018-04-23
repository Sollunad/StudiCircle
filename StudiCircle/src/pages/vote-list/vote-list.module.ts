import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoteListPage } from './vote-list';

@NgModule({
  declarations: [
    VoteListPage,
  ],
  imports: [
    IonicPageModule.forChild(VoteListPage),
  ],
})
export class VoteListPageModule {}
