import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ListPayableComponent } from './components/list-payable/list-payable.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ActionsPayableComponent } from './components/actions-payable/actions-payable.component';
import { StageBillDocumentsComponent } from './components/stage-bill-documents/stage-bill-documents.component';
import { BillDataComponent } from './components/bill-data/bill-data.component';
import { StageMovementsPayableComponent } from './components/stage-movements-payable/stage-movements-payable.component';
import { ModalStageBillDocumentsComponent } from './modais/modal-stage-bill-documents/modal-stage-bill-documents.component';
import { ModalConfiguredAutomaticRoutinesComponent } from './modais/modal-configured-automatic-routines/modal-configured-automatic-routines.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListPayableComponent
  },
  {
    path: 'actions',
    component: ActionsPayableComponent
  }
]

@NgModule({
  declarations: [
    ListPayableComponent,
    ActionsPayableComponent,
    StageBillDocumentsComponent,
    BillDataComponent,
    StageMovementsPayableComponent,
    ModalStageBillDocumentsComponent,
    ModalConfiguredAutomaticRoutinesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild(),
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class AccountsPayableModule { }
