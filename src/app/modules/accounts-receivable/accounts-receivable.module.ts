import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ListReceivableComponent } from './components/list-receivable/list-receivable.component';
import { ActionsReceivableComponent } from './components/actions-receivable/actions-receivable.component';
import { StageBillDataComponent } from './components/stage-bill-data/stage-bill-data.component';
import { StageFreightDocumentsComponent } from './components/stage-freight-documents/stage-freight-documents.component';
import { ModalSearchResultCtesComponent } from './modais/modal-search-result-ctes/modal-search-result-ctes.component';
import { StageMovementsComponent } from './components/stage-movements/stage-movements.component';
import { ModalLaunchMovementComponent } from './modais/modal-launch-movement/modal-launch-movement.component';
import { ModalSendToBankComponent } from './modais/modal-send-to-bank/modal-send-to-bank.component';
import { ModalSendReceivableEmailComponent } from './modais/modal-send-receivable-email/modal-send-receivable-email.component';
import { ModalDecreaseBillComponent } from './modais/modal-decrease-bill/modal-decrease-bill.component';
import { ModalReverseBillComponent } from './modais/modal-reverse-bill/modal-reverse-bill.component';
import { StageBilletDataComponent } from './components/stage-billet-data/stage-billet-data.component';
import { ListPendingDocumentsComponent } from './components/list-pending-documents/list-pending-documents.component';
import { ModalBillingDocumentsComponent } from './modais/modal-billing-documents/modal-billing-documents.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListReceivableComponent
  },
  {
    path: 'actions',
    component: ActionsReceivableComponent
  },
  {
    path: 'pending-documents',
    component: ListPendingDocumentsComponent
  }
]

@NgModule({
  declarations: [
    ListReceivableComponent,
    ActionsReceivableComponent,
    StageBillDataComponent,
    StageFreightDocumentsComponent,
    ModalSearchResultCtesComponent,
    StageMovementsComponent,
    ModalLaunchMovementComponent,
    ModalSendToBankComponent,
    ModalSendReceivableEmailComponent,
    ModalDecreaseBillComponent,
    ModalReverseBillComponent,
    StageBilletDataComponent,
    ListPendingDocumentsComponent,
    ModalBillingDocumentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild(),
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class AccountsReceivableModule { }
