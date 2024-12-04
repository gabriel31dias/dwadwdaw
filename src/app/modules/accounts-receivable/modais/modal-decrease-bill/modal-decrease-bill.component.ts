import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { BaixaFatura } from '../../models/bill-decrease.model';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-modal-decrease-bill',
  templateUrl: './modal-decrease-bill.component.html',
  styleUrls: ['./modal-decrease-bill.component.scss']
})
export class ModalDecreaseBillComponent {

  companyId: string;
  accounts: string[] = [];
  accountsObj: any[] = [];
  billDecrease: BaixaFatura = <BaixaFatura>{};
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  idsBill: string[] = [];
  billSelecteds: number = 0;
  valueBills: string = 'R$ 0,00';

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storage: StorageService,
    private receivableService: ReceivableService
  ) {
    this.companyId = storage.getCompanyId()!;
    this.getAccounts();
  }

  // Fecha o modal.
  close() {
    this.modal.close();
  }

  // Busca as contas correntes de acordo com a empresa do usuário logado.
  getAccounts() {
    this.receivableService.getLists(this.companyId).subscribe({
      next: (response) => {
        // Dropdown de conta corrente e agência
        this.accounts = [];
        this.accountsObj = response.dados.contasCorrente;
        for (const account of response.dados.contasCorrente) {
          const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

          this.accounts.push(
            `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`
          )
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Aplica a conta corrente selecionada no dropdown.
  accountSelected(index: number | null) {
    if (index === null) {
      this.billDecrease.cdContaCorrente = '';
    } else {
      this.billDecrease.cdContaCorrente = this.accountsObj[index].cdConta;
    }
  }

  // Função chamada após o usuário clicar o botão de confirmação, que verifica se os dados estão corretos.
  confirm() {
    if (this.billDecrease.cdContaCorrente &&
      this.billDecrease.observacao &&
      this.billDecrease.dataHora
    ) {
      this.decreaseBill();
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposModalBaixaFatura';
    }
  }

  // Realiza a baixa da(s) fatura(s).
  decreaseBill() {
    this.loading = true;
    this.billDecrease.ids = this.idsBill;
    const billDecreaseCopy = { ...this.billDecrease };
    billDecreaseCopy.dataHora = `${billDecreaseCopy.dataHora}T00:00:00`;
    this.receivableService.decreaseBill(this.companyId, billDecreaseCopy).subscribe({
      next: (response) => {
        this.loading = false;
        this.modal.close('success');
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

}
