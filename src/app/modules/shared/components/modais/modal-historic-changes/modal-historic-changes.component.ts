import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Historico } from '../../../models/historic-change.model';
import { ModalDetailsChangeComponent } from '../modal-details-change/modal-details-change.component';
import { hiddenModal, visibleModal } from 'src/app/modules/shared/utils/modal-utils';
import { CollectionService } from '../../../../collection/services/collection.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ConferenceService } from 'src/app/modules/conference/services/conference.service';
import { formatUTCToLocal } from 'src/app/modules/shared/utils/date-utils';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ReceivableService } from 'src/app/modules/accounts-receivable/services/receivable.service';

@Component({
  selector: 'app-modal-historic-changes',
  templateUrl: './modal-historic-changes.component.html',
  styleUrls: ['./modal-historic-changes.component.scss']
})
export class ModalHistoricChangesComponent implements OnInit {

  companyId: string;
  headers: string[] = ['usuario', 'acao', 'data', 'hora', 'quantidadeDeAlteracoes'];
  historics: Historico[] = [];
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;

  module!: 'collection' | 'conference' | 'accounts-receivable';
  codeHistoric!: any;

  constructor(private translate: TranslateService,
    private storageService: StorageService,
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private collectionService: CollectionService,
    private conferenceService: ConferenceService,
    private receivableService: ReceivableService
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;
  }

  ngOnInit(): void {
    // Chama o endpoint de busca de cada módulo de acordo com o "module" passado.
    if (this.module === 'collection') this.getHistoricCollection();
    if (this.module === 'conference') this.getHistoricConference();
    if (this.module === 'accounts-receivable') this.getHistoricReceivable();
  }

  // Fecha o modal.
  close() {
    this.modal.close(false);
  }

  // Busca o histórico de alterações da Coleta.
  getHistoricCollection() {
    this.loading = true;
    this.collectionService.getHistoricCollection(this.companyId, this.codeHistoric.cdColeta, this.codeHistoric.cdFilEmp).subscribe({
      next: (response) => {
        this.loading = false;
        this.setHistoric(response.dados.historicos);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  // Busca o histórico de alterações da Conferência.
  getHistoricConference() {
    this.loading = true;
    this.conferenceService.getHistoricConference(this.companyId, Number(this.codeHistoric)).subscribe({
      next: (response) => {
        this.loading = false;
        this.setHistoric(response.dados.historicos);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }
  // Busca o histórico de alterações da Fatura (Contas a Receber).
  getHistoricReceivable() {
    this.loading = true;
    this.receivableService.getHistoricReceivable(this.companyId, String(this.codeHistoric)).subscribe({
      next: (response) => {
        this.loading = false;
        this.setHistoric(response.dados.historicos);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  // Monta o histórico retornado pela API.
  setHistoric(historics: any[]) {
    if (historics.length >= 1) {
      for (const historic of historics) {
        // Formatação do histórico.
        const newHistoric: Historico = <Historico>{};
        const dateTime = formatUTCToLocal(historic.historico.dataHora);
        [ newHistoric.data, newHistoric.hora ] = dateTime.split(' - ');
        newHistoric.usuario = historic.historico.login;
        newHistoric.acao = historic.historico.acao;
        newHistoric.quantidadeDeAlteracoes = historic.historico.quantidadeDeAlteracoes;
        newHistoric.detalhes = historic.detalhes;
        this.historics.push(newHistoric);
      }
    } else {
      this.loading = false;
      this.snackbar.open = true;
      this.snackbar.message = 'historicoNaoEncontrado';

      setTimeout(() => {
        this.close()
      }, 3000);
    }
  }

  // Abre o modal de detalhes da alteração.
  getDetails(historic: Historico) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-historic-changes',
    };
    const modalRef = this.modalService.open(ModalDetailsChangeComponent, modalOptions);
    modalRef.componentInstance.historic = historic;

    this.modal.update(hiddenModal);
    modalRef.dismissed.subscribe(() => {
      this.modal.update(visibleModal);
    });

    modalRef.result
      .then((res: boolean) => {
        this.modal.update(visibleModal);
      })
      .catch((res) => {
        this.modal.update(visibleModal);
      })
  }
}
