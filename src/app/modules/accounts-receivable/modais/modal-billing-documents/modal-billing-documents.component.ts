import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ReceivableService } from '../../services/receivable.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { IndexListsBillData } from '../../models/index-lists-selected.model';
import { DadosFatura, ListasDadosFatura } from '../../models/bill-include.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { CreateAccountReceivable } from '../../models/create-account-receivable.model';
import { PendingDocumentService } from '../../services/pending-document.service';

type CreateBillingWithCTes = Pick<
  CreateAccountReceivable,
  'cdBanco'
  | 'cdConta'
  | 'cdCondicaoPagamento'
  | 'cdGrupoReceita'
  | 'cdContaReceita'
  | 'cdFilialCobranca'
  | 'cdCentroCustos'
  | 'observacoesInternas'
> & { data: string }
@Component({
  selector: 'app-modal-billing-documents',
  templateUrl: './modal-billing-documents.component.html',
  styleUrls: ['./modal-billing-documents.component.scss']
})
export class ModalBillingDocumentsComponent {

  companyId: string;
  numsCTes: number[] = [];
  useConfigBilling: boolean = true;
  groupDocuments: boolean = true;
  dropdownsBack: any;
  accountsReceiptBack: any;
  indexSelecteds: IndexListsBillData = <IndexListsBillData>{};
  lists: ListasDadosFatura = <ListasDadosFatura>{};
  banksList: any[] = [];
  loading: boolean = false;
  alertRequired: boolean = false;
  snackbar: Snackbar = new Snackbar();
  billData: DadosFatura = <DadosFatura>{};

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storageService: StorageService,
    private receivableService: ReceivableService,
    private pendingDocumentService: PendingDocumentService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;

    this.getLists();
  }

  close() {
    this.modal.close({
      status: false,
      message: null
    });
  }

  // Verifica se o usuário preencheu todos os campos obrigatórios.
  verifyRequired(): boolean {
    if (this.billData.contaCorrenteAgencia &&
      this.billData.banco &&
      this.billData.dataVencimento
    ) {
      return true;
    } else {
      this.alertRequired = true;
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaTodosCamposObrigatorios';
      return false;
    }
  }

  confirm() {
    if (!this.useConfigBilling && !this.verifyRequired()) return;

    const request: CreateBillingWithCTes | null = this.useConfigBilling ? null : this.prepareRequest();
    this.loading = true;
    this.pendingDocumentService.createBillingWithDocuments(
      this.companyId,
      this.numsCTes,
      request,
      this.useConfigBilling,
      this.groupDocuments,
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.modal.close({
          status: true,
          message: response.mensagem
        });
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  prepareRequest(): CreateBillingWithCTes {
    try {
      const request: CreateBillingWithCTes = <CreateBillingWithCTes>{};
      // Campos obrigatórios
      request.cdBanco = this.billData.banco
        ? this.dropdownsBack.contasCorrente[this.indexSelecteds.contaCorrente].cdPortador
        : '';
      request.cdConta = this.billData.contaCorrenteAgencia
        ? this.dropdownsBack.contasCorrente[this.indexSelecteds.contaCorrente].cdConta
        : this.billData.cdConta;
      request.data = `${this.billData.dataVencimento}T00:00:00`;

      // Campos não obrigatórios
      request.cdFilialCobranca = this.billData.filialCobranca
        ? this.dropdownsBack.filiaisCobranca[this.indexSelecteds.filialCobranca].cdFilial
        : '';
      request.cdCondicaoPagamento = this.billData.descricao
        ? this.dropdownsBack.condicoesPagamento[this.indexSelecteds.descricao].cdCondPgto
        : '';
      request.cdGrupoReceita = this.billData.grupoReceita
        ? this.dropdownsBack.gruposReceita[this.indexSelecteds.grupoReceita].cdGrupo
        : '';
      request.cdContaReceita = this.billData.contaReceita
        ? this.accountsReceiptBack[this.indexSelecteds.contaReceita].cdContas
        : '';
      request.cdCentroCustos = this.billData.centroCustos
        ? this.dropdownsBack.centroCusto[this.indexSelecteds.centroCustos].cdCentroCusto
        : '';
      request.observacoesInternas = this.billData.observacaoInterna ? this.billData.observacaoInterna : '';

      return request;
    } catch (error) {
      this.snackbar.open = true;
      this.snackbar.message = 'erroCriacaoFaturaFront';
      throw error;
    }
  }

  // Realiza a busca das listagens para o dropdown.
  getLists() {
    this.receivableService.getLists(this.companyId).subscribe({
      next: (response) => {
        this.dropdownsBack = response.dados;
        // Dropdown de conta corrente e agência
        this.lists.contasCorrenteAgencia = [];
        for (const account of response.dados.contasCorrente) {
          const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

          this.lists.contasCorrenteAgencia.push(
            `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`
          )
        }

        // Dropdown de grupo de receita
        this.lists.gruposReceita = [];
        for (const group of response.dados.gruposReceita) {
          this.lists.gruposReceita.push(group.dcGrupo)
        }

        // Dropdown de descrição de condições de pagamento
        this.lists.descricoes = [];
        for (const descrition of response.dados.condicoesPagamento) {
          this.lists.descricoes.push(descrition.dcCondPgto)
        }

        // Dropdown de filiais de cobrança
        this.lists.filiaisCobranca = [];
        for (const subsidiary of response.dados.filiaisCobranca) {
          this.lists.filiaisCobranca.push(subsidiary.nome)
        }

        // Dropdown de centros de custo
        this.lists.centrosCusto = [];
        for (const costCenter of response.dados.centroCusto) {
          this.lists.centrosCusto.push(costCenter.dcCentroCusto)
        }

        this.getBanks();
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca dos bancos.
  getBanks() {
    this.receivableService.getBanks(this.companyId).subscribe({
      next: (response) => {
        this.banksList = response.dados;

        this.lists.bancos = [];
        for (const bank of this.banksList) {
          this.lists.bancos.push(bank.nome);
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  bankSeleced(bankCode: string | null) {
    if (bankCode !== null) {
      this.getCurrentAccountByBank(bankCode);
    } else {
      this.getLists()
    }
  }

  getCurrentAccountByBank(bankCode: string) {
    this.receivableService.getCurrentAccountByBank(this.companyId, bankCode).subscribe({
      next: (response) => {
        this.dropdownsBack.contasCorrente = {};
        this.dropdownsBack.contasCorrente = response.dados;
        // Dropdown de conta corrente e agência
        this.lists.contasCorrenteAgencia = [];
        for (const account of response.dados) {
          const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

          this.lists.contasCorrenteAgencia.push(
            `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`
          )
        }

        if (this.billData.contaCorrenteAgencia) {
          this.indexSelecteds.contaCorrente = this.lists.contasCorrenteAgencia.findIndex((account: string) =>
            account === this.billData.contaCorrenteAgencia
          );
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca das contas de receita.
  getReceiptAccount() {
    this.loading = true;
    const cdGroup = this.billData.cdGrupoReceita
      ? this.billData.cdGrupoReceita
      : this.dropdownsBack.gruposReceita[this.indexSelecteds.grupoReceita].cdGrupo;

    this.receivableService.getReceiptAccount(this.companyId, cdGroup).subscribe({
      next: (response) => {
        this.accountsReceiptBack = response.dados;
        // Dropdown de contas de receita
        this.lists.contasReceita = [];
        for (const receiptAccount of response.dados) {
          this.lists.contasReceita.push(receiptAccount.dcContas)
        }

        this.loading = false;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.loading = false;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Insere a opção selecionada pelo usuário no dropdown e realiza ações de acordo com a seleção.
  selectedOption(option: 'contaCorrenteAgencia' | 'banco' | 'descricao' | 'grupoReceita' | 'contaReceita' | 'filialCobranca' | 'centroCustos',
    index: number
  ) {
    switch (option) {
      case 'contaCorrenteAgencia':
        this.billData.contaCorrenteAgencia = this.lists.contasCorrenteAgencia[index];
        this.indexSelecteds.contaCorrente = index;
        if (!this.billData.banco) {
          this.billData.banco = this.dropdownsBack.contasCorrente[index].nomeBanco;
          this.bankSeleced(this.dropdownsBack.contasCorrente[index].cdPortador);
        }
        break;

      case 'banco':
        this.billData.banco = this.lists.bancos[index];
        this.indexSelecteds.banco = index;
        this.billData.contaCorrenteAgencia = null;
        this.bankSeleced(this.banksList[index].id);
        break;

      case 'descricao':
        this.billData.descricao = this.lists.descricoes[index];
        this.indexSelecteds.descricao = index;
        this.getDateConditionPayment(this.dropdownsBack.condicoesPagamento[index].prazo);
        break;

      case 'grupoReceita':
        this.billData.grupoReceita = this.lists.gruposReceita[index];
        this.indexSelecteds.grupoReceita = index;
        setTimeout(() => {
          this.getReceiptAccount();
        }, 0);
        break;

      case 'contaReceita':
        this.billData.contaReceita = this.lists.contasReceita[index];
        this.indexSelecteds.contaReceita = index;
        break;

      case 'filialCobranca':
        this.billData.filialCobranca = this.lists.filiaisCobranca[index];
        this.indexSelecteds.filialCobranca = index;
        break;

      case 'centroCustos':
        this.billData.centroCustos = this.lists.centrosCusto[index];
        this.indexSelecteds.centroCustos = index;
        break;
    }
  }

  clearBankSelected() {
    this.billData.banco = null;
    this.billData.contaCorrenteAgencia = null;
    this.bankSeleced(null);
  }

  clearReceipt() {
    this.billData.grupoReceita = null;
    this.billData.contaReceita = null;
  }

  // Busca a data e hora atual.
  getDateConditionPayment(days: number) {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + days)
    const day = dateNow.getDate().toString().padStart(2, '0');
    const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
    const year = dateNow.getFullYear();

    this.billData.dataVencimento = `${year}-${month}-${day}`;
  }

}
