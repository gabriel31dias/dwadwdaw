import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { ListCollectionsComponent } from './components/list-collections/list-collections.component';
import { SharedModule } from '../shared/shared.module';
import { ModalDownloadCollectionComponent } from './modais/modal-download-collection/modal-download-collection.component';
import { ActionsCollectionComponent } from './components/actions-collection/actions-collection.component';
import { StageInfoCollectionComponent } from './components/stage-info-collection/stage-info-collection.component';
import { StageLoadTotalsComponent } from './components/stage-load-totals/stage-load-totals.component';
import { StageDeliveryPlaceComponent } from './components/stage-delivery-place/stage-delivery-place.component';
import { StageDriverComponent } from './components/stage-driver/stage-driver.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListCollectionsComponent,
  },
  {
    path: 'actions',
    component: ActionsCollectionComponent
  }
]

@NgModule({
  declarations: [
    ListCollectionsComponent,
    ModalDownloadCollectionComponent,
    ActionsCollectionComponent,
    StageInfoCollectionComponent,
    StageLoadTotalsComponent,
    StageDeliveryPlaceComponent,
    StageDriverComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild(),
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class CollectionModule { }
