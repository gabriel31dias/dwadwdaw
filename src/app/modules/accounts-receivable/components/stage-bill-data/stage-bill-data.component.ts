import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { DadosFatura, ListasDadosFatura } from '../../models/bill-include.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ModalIncludeClientComponent } from 'src/app/modules/shared/components/modais/modal-include-client/modal-include-client.component';
import { CollectionService } from 'src/app/modules/collection/services/collection.service';
import { ModalSearchClientComponent } from 'src/app/modules/shared/components/modais/modal-search-client/modal-search-client.component';
import { ReceivableService } from '../../services/receivable.service';
import { IndexListsBillData } from '../../models/index-lists-selected.model';
import { removeMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';

@Component({
  selector: 'app-stage-bill-data',
  templateUrl: './stage-bill-data.component.html',
  styleUrls: ['./stage-bill-data.component.scss']
})
export class StageBillDataComponent implements OnChanges {

  companyId: string;
  @Input() billData: DadosFatura = <DadosFatura>{};
  @Input() lists: ListasDadosFatura = <ListasDadosFatura>{};
  @Input() alertRequired: boolean = false;
  @Output() billDataEmitter: EventEmitter<DadosFatura> = new EventEmitter<DadosFatura>();
  companies: any[] = [];
  companiesList: any[] = [];
  timeout: any;
  loading: boolean = false;
  @Input() indexSelecteds: IndexListsBillData = <IndexListsBillData>{};
  @Output() indexOptionsEmitter: EventEmitter<IndexListsBillData> = new EventEmitter<IndexListsBillData>();
  @Output() receiptEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() dropdownsBack: any;
  @Input() disableFields: boolean = false;
  @Input() disableValueBill: boolean = false;
  @Input() banksList: any[] = [];
  @Input() accountsOfBank: any[] = [];
  @Output() accountsOfBankEmitter: EventEmitter<string | null> = new EventEmitter<string | null>();
  @Input() nameClient: string = '';
  @Output() nameClientEmitter: EventEmitter<string> = new EventEmitter<string>();
  permissions: string[] = [];

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private collectionService: CollectionService,
    private readonly storageService: StorageService,
    private receivableService: ReceivableService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['billData']) {
      this.billDataEmitter.emit(this.billData);
    }
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

  // Funções para input de busca de CNPJ.
  search(text: string) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loading = true;
    this.timeout = setTimeout(() => {
      this.collectionService.getClients(this.companyId, text).subscribe({
        next: (response) => {
          this.companies = response.dados;
          this.companiesList = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
          this.loading = false;
        },
        error: (response) => {
          this.loading = false;


        }
      });
    }, 1000);
  }

  cnpjSelected(selected: any) {
    if (selected !== null) {
      if (selected == 0) {
        this.openModalSearchClient();
      } else {
        let item: any = this.companies.at(selected - 1);

        this.billData.cnpj = item.cpfCnpj + ' - ' + item.nomeFantasia;
        this.billData.nomeFantasia = item.nomeFantasia;
        this.billData.cdCliente = item.cdCliente;
        this.getConfigClient()
      }
    } else {
      this.clearConfigsClient();
    }
  }

  // Retorna as configurações de faturamento do cliente.
  getConfigClient() {
    this.loading = true;
    this.nameClient = this.billData.nomeFantasia;
    this.nameClientEmitter.emit(this.nameClient);
    this.receivableService.getConfigClient(this.companyId, this.billData.cdCliente).subscribe({
      next: (response) => {
        this.loading = false;
        this.billData.banco = response.dados.banco ? response.dados.banco.dcPortador : null;
        this.billData.cdBanco = response.dados.banco ? response.dados.banco.cdBanco : null;

        if (this.billData.cdBanco) this.accountsOfBankEmitter.emit(this.billData.cdBanco);
        if (response.dados.contaCorrente) {
          const account = response.dados.contaCorrente;
          const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

          this.billData.contaCorrenteAgencia = `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`;
          this.billData.cdConta = account.cdConta;
        } else {
          this.billData.contaCorrenteAgencia = null;
          this.billData.cdConta = null;
        }

        this.billData.filialCobranca = response.dados.filialCobranca ? response.dados.filialCobranca.rzSocialFil : null;
        this.billData.cdFilialCobranca = response.dados.filialCobranca ? response.dados.filialCobranca.cdFilEmp : null;
        this.billData.descricao = response.dados.condicaoPagamento ? response.dados.condicaoPagamento.dcCondPgto : null;
        this.billData.cdCondicaoPagamento = response.dados.condicaoPagamento ? response.dados.condicaoPagamento.cdCondPgto : null;

        if (response.dados.condicaoPagamento) {
          this.getDateConditionPayment(response.dados.condicaoPagamento.prazo);
        } else {
          this.billData.dataVencimento = null;
        }

        this.billData.grupoReceita = response.dados.grupoReceita ? response.dados.grupoReceita.dcGrupo : null;
        this.billData.cdGrupoReceita = response.dados.grupoReceita ? response.dados.grupoReceita.cdGrupo : null;
        if (response.dados.grupoReceita) this.receiptEmitter.emit();
        this.billData.contaReceita = response.dados.contaReceita ? response.dados.contaReceita.dcContas : null;
        this.billData.cdContaReceita = response.dados.contaReceita ? response.dados.contaReceita.cdContas : null;
        this.billData.centroCustos = response.dados.centroCusto ? response.dados.centroCusto.dcCentroCusto : null;
        this.billData.cdCentroCustos = response.dados.centroCusto ? response.dados.centroCusto.cdCentroCusto : null;
      },
      error: (response) => {
        this.loading = false;
      }
    })
  }

  openModalSearchClient() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalSearchClientComponent, modalOptions);

    modalRef.result
      .then((res: any) => {
        if (res) {
          this.billData.cnpj = res.cnpj + ' - ' + res.nomeFantasia;
          this.billData.nomeFantasia = res.nomeFantasia;
          this.billData.cdCliente = removeMaskCpfCnpj(res.cnpj);
          this.getConfigClient()
        }
      })
      .catch((res) => {

      })
  }

  openEditClient() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalIncludeClientComponent, modalOptions);
    modalRef.componentInstance.edit = true;
    modalRef.componentInstance.cdClient = this.billData.cdCliente;
    modalRef.componentInstance.cnpjSearch = this.billData.cnpj?.split(' - ')[0];


    modalRef.result
      .then((res: any) => {
        if (res) {
          const clientEdited = res;
          this.billData.cnpj = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
          this.billData.nomeFantasia = clientEdited.nomeFantasia;
          this.billData.cdCliente = clientEdited.cdCliente;
          this.getConfigClient()
        }
      })
      .catch((res) => {

      })
  }
  // FIM funções para input de busca de CNPJ

  selectedOption(option: 'contaCorrenteAgencia' | 'banco' | 'descricao' | 'grupoReceita' | 'contaReceita' | 'filialCobranca' | 'centroCustos',
    index: number
  ) {
    switch (option) {
      case 'contaCorrenteAgencia':
        this.billData.contaCorrenteAgencia = this.lists.contasCorrenteAgencia[index];
        this.indexSelecteds.contaCorrente = index;
        if (!this.billData.banco) {
          this.billData.banco = this.dropdownsBack.contasCorrente[index].nomeBanco;
          this.accountsOfBankEmitter.emit(this.dropdownsBack.contasCorrente[index].cdPortador);
        }
        break;

      case 'banco':
        this.billData.banco = this.lists.bancos[index];
        this.indexSelecteds.banco = index;
        this.billData.contaCorrenteAgencia = null;
        this.accountsOfBankEmitter.emit(this.banksList[index].id);
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
          this.receiptEmitter.emit()
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
    this.indexOptionsEmitter.emit(this.indexSelecteds);
  }

  clearBankSelected() {
    this.billData.banco = null;
    this.billData.contaCorrenteAgencia = null;
    this.accountsOfBankEmitter.emit(null);
  }

  clearReceipt() {
    this.billData.grupoReceita = null;
    this.billData.contaReceita = null;
  }

  clearConfigsClient() {
    this.billData.banco = null;
    this.billData.cdBanco = null;
    this.billData.contaCorrenteAgencia = null;
    this.billData.cdConta = null;
    this.billData.filialCobranca = null;
    this.billData.cdFilialCobranca = null;
    this.billData.descricao = null;
    this.billData.dataVencimento = null;
    this.billData.cdCondicaoPagamento = null;
    this.billData.grupoReceita = null;
    this.billData.cdGrupoReceita = null;
    this.billData.contaReceita = null;
    this.billData.cdContaReceita = null;
    this.billData.centroCustos = null;
    this.billData.cdCentroCustos = null;
  }

}
