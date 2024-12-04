import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ActionsConferenceComponent } from './components/actions-conference/actions-conference.component';
import { StageInvoicesComponent } from './components/stage-invoices/stage-invoices.component';
import { StageConferenceComponent } from './components/stage-conference/stage-conference.component';
import { ListConferenceComponent } from './components/list-conference/list-conference.component';
import { SharedModule } from '../shared/shared.module';
import { ModalDisagreementConferenceComponent } from './modais/modal-disagreement-conference/modal-disagreement-conference.component';
import { ModalSearchVolumesComponent } from './modais/modal-search-volumes/modal-search-volumes.component';
import { ModalPermissionComponent } from './modais/modal-permission/modal-permission.component';
import { ModalObservationVolumeComponent } from './modais/modal-observation-volume/modal-observation-volume.component';
import { VolumesDisagreementComponent } from './components/volumes-disagreement/volumes-disagreement.component';
import { ActionsVolumesDisagreementComponent } from './components/actions-volumes-disagreement/actions-volumes-disagreement.component';
import { ModalGenerateTitleComponent } from './modais/modal-generate-title/modal-generate-title.component';
import { ModalSearchSupplierComponent } from './modais/modal-search-supplier/modal-search-supplier.component';
import { ModalIncludeSupplierComponent } from './modais/modal-include-supplier/modal-include-supplier.component';
import { ModalObservationComponent } from './modais/modal-observation/modal-observation.component';
import { StageCheckingInvoicesComponent } from './components/stage-checking-invoices/stage-checking-invoices.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListConferenceComponent,
  },
  {
    path: 'actions',
    component: ActionsConferenceComponent
  },
  {
    path: 'volumes-disagreement',
    component: VolumesDisagreementComponent
  },
  {
  path: 'actions/volumes-disagreement',
  component: ActionsVolumesDisagreementComponent
  }
]

@NgModule({
  declarations: [
    ActionsConferenceComponent,
    StageInvoicesComponent,
    StageConferenceComponent,
    ListConferenceComponent,
    ModalDisagreementConferenceComponent,
    ModalSearchVolumesComponent,
    ModalPermissionComponent,
    ModalObservationVolumeComponent,
    VolumesDisagreementComponent,
    ActionsVolumesDisagreementComponent,
    VolumesDisagreementComponent,
    ModalGenerateTitleComponent,
    ModalSearchSupplierComponent,
    ModalIncludeSupplierComponent,
    ModalObservationComponent,
    StageCheckingInvoicesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild(),
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class ConferenceModule { }
