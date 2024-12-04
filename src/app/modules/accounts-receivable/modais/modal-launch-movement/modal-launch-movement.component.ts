import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { Movimento } from '../../models/movement.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ReceivableService } from '../../services/receivable.service';
import { formatDateBrToUtc } from 'src/app/modules/shared/utils/date-utils';

@Component({
  selector: 'app-modal-launch-movement',
  templateUrl: './modal-launch-movement.component.html',
  styleUrls: ['./modal-launch-movement.component.scss'],
})
export class ModalLaunchMovementComponent {

  companyId: string;
  types: any[] = [];
  typesList: string[] = [];
  accounts: any[] = [];
  accountsList: string[] = [];
  movement: Movimento = <Movimento>{};
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  onlyView: boolean = false;
  idBill: string = '';
  alertRequired: boolean = false;

  constructor(
    private translate: TranslateService,
    private modal: NgbActiveModal,
    private storage: StorageService,
    private receivableService: ReceivableService
  ) {
    this.companyId = storage.getCompanyId()!;

    if (!this.onlyView) {
      this.getTypesMovement();
      this.getCurrentAccounts();
    }
  }

  close() {
    this.modal.close();
  }

  getTypesMovement() {
    this.loading = true;
    this.receivableService.getTypesMovement(this.companyId).subscribe({
      next: (response) => {
        this.types = response.dados;
        this.typesList = [];
        for (const type of response.dados) {
          this.typesList.push(type.descricao);
        }
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }

  getCurrentAccounts() {
    this.loading = true;
    this.receivableService.getCurrentAccounts(this.companyId).subscribe({
      next: (response) => {
        // Dropdown de conta corrente e agência
        this.accounts = response.dados;
        this.accountsList = [];
        for (const account of response.dados) {
          const digitoAgencia =
            account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta =
            account.digitoConta !== null ? `-${account.digitoConta}` : '';
          const nomeBanco = account.nomeBanco !== null ? account.nomeBanco : '';
          const dadosContaCorrente = `${account.agencia + digitoAgencia} / ${
            account.conta + digitoConta
          } - ${nomeBanco}`;
          this.accountsList.push(dadosContaCorrente);
        }
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }

  setTypeMovement(index: number | null) {
    if (index !== null) {
      this.movement.codigoTipoMovimento = this.types[index].cdTpMovi;
      this.movement.movimentaCaixa = this.types[index].movimentaCaixa;
      this.movement.tipoMovimento = this.typesList[index];

      if (this.movement.contaCorrente && !this.movement.movimentaCaixa) {
        this.movement.contaCorrente = null;
      }
    } else {
      this.movement.tipoMovimento = null;
      this.movement.contaCorrente = null;
      this.movement.movimentaCaixa = false;
    }
  }

  setAccount(index: number | null) {
    if (index !== null) {
      this.movement.codigoConta = this.accounts[index].cdConta;
      this.movement.contaCorrente = this.accountsList[index];
    } else {
      this.movement.contaCorrente = null;
    }
  }

  confirm() {
    if (
      this.movement.codigoTipoMovimento &&
      this.movement.data &&
      this.movement.valor
    ) {
      if (this.movement.movimentaCaixa && !this.movement.codigoConta) {
        this.snackbar.open = true;
        this.snackbar.message = 'preenchaContaCorrenteLancarMovimento';
      } else {
        this.movement.usuario = this.storage.getNameUser()!;
        this.launchMovement();
      }
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaTodosCamposObrigatorios';
      this.alertRequired = true;
    }
  }

  launchMovement() {
    const body = {
      id: this.idBill,
      cdTipoMovimento: this.movement.codigoTipoMovimento,
      cdContaCorrente: this.movement.movimentaCaixa
        ? this.movement.codigoConta
        : null,
      dataHora: `${this.movement.data}T00:00:00`,
      valor: this.movement.valor,
      observacao: this.movement.observacao,
    };

    this.loading = true;
    this.receivableService.launchMovement(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.modal.close('success');
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }

  formatDate(date: string) {
    if (!date) return '';
    return formatDateBrToUtc(date);
  }
}
