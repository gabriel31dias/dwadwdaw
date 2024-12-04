import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ModalSearchResultCtesComponent } from '../../modais/modal-search-result-ctes/modal-search-result-ctes.component';
import { ReceivableService } from '../../services/receivable.service';
import { TableSimpleGridComponent } from 'src/app/modules/shared/components/tables/table-simple-grid/table-simple-grid.component';
import { InputSearchComponent } from 'src/app/modules/shared/components/inputs/input-search/input-search.component';
import { formatDateStringUTC, formatDateUtcToBr, formatOnlyDateBack } from 'src/app/modules/shared/utils/date-utils';
import { setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { ContasAReceberPermissoes } from 'src/app/modules/shared/consts/permissions.const';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { PeriodsFilter } from 'src/app/modules/shared/consts/periods-filter.const';
import { setWeekDate } from 'src/app/modules/shared/utils/period.utils';

@Component({
  selector: 'app-stage-freight-documents',
  templateUrl: './stage-freight-documents.component.html',
  styleUrls: ['./stage-freight-documents.component.scss']
})
export class StageFreightDocumentsComponent implements OnInit{

  companyId: string;
  permissions: string[];
  authReceivable = ContasAReceberPermissoes;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  columns: ColumnSlickGrid[] = [];
  @Input() ctes: any[] = [];
  @Output() ctesEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild(TableSimpleGridComponent) tableComponent!: TableSimpleGridComponent;
  @ViewChild(InputSearchComponent) InputSearchComponent!: InputSearchComponent;
  @Input() disableFields: boolean = false;
  idBill: string = '';
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  filterDateSelected: number | null = null;
  @Input() clientNameFilter: string = '';

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private readonly storageService: StorageService,
    private receivableService: ReceivableService,
    private route: ActivatedRoute
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.idBill = queryParams['number'];
      }
    })

    this.getHeaderTable();
  }

  // Monta as colunas do GRID.
  getHeaderTable() {
    this.columns = [
      { name: 'Conhecimento', id: 'conhecimento', width: 150 },
      { name: 'Série', id: 'serie', width: 150 },
      { name: 'Data de emissão', id: 'dataEmissao', width: 150 },
      { name: 'Tipo de CT-e', id: 'tipoCTe', width: 150 },
      { name: 'Remetente', id: 'nomeRemetente', width: 150 },
      { name: 'Destinatário', id: 'nomeDestinatario', width: 150 },
      { name: 'Pagador', id: 'nomeCliente', width: 150 },
      { name: 'Tipo de documento', id: 'tipoDocumento', width: 150 },
      { name: 'Pré fatura', id: 'preFatura', width: 150 },
      { name: 'Valor do frete', id: 'valorFrete', width: 150 }
    ]
  }

  ngOnInit(): void {
    this.setInitialFilter();
  }

  setInitialFilter() {
    this.periodFilter = setWeekDate();
    this.filterDateSelected = 0;
  }

  // Faz a busca de CT-es e vincula à fatura.
  doSearch(search: string, forceSelect?: boolean) {
    if(search === 'openModal'){
      this.openModalSearchResult('');
      return;
    }
    this.loading = true;
    this.receivableService.getCtesReceivable(this.companyId, search).subscribe({
      next: (response) => {
        // Verifica se foi retornado 1 ou mais CT-e.
        if (response.dados.items.length > 1) {
          // Se foceSelect for false ou undefined, é realizada a verificação para busca avançada de CT-e.
          if (forceSelect !== true) {
            const ctesBack = response.dados.items;
            const ctesUnlinked: any[] = [];
            for (const cteBack of ctesBack) {
              cteBack.dataEmissao = formatOnlyDateBack(cteBack.dataEmissao);
              cteBack.valorFrete = setCurrencyMask(cteBack.valorFrete);
              // Faz a verificação se os CT-e retornados já estão vinculados no GRID.
              let exist: boolean = false;
              this.ctes.forEach(cte => {
                if (cte.noCTRC === cteBack.noCTRC &&
                  cte.cdEmpresa === cteBack.cdEmpresa &&
                  cte.cdFilEmp === cteBack.cdFilEmp
                ) {
                  exist = true;
                }
              });

              // Se o CT-e não estiver vinculado no GRID, é inserido na váriavel ctesUnlinked.
              if (!exist) ctesUnlinked.push(cteBack);
            }

            // Verifica se exite mais de 1 CT-e não vinculado no GRID, se existir, abre o modal de busca avançada.
            if (ctesUnlinked.length > 1) this.openModalSearchResult(search);
            // Verifica se existe apenas 1 CT-e não vinculado no GRID, se existir apenas 1, é enviado para verificação para ser vinculado.
            if (ctesUnlinked.length === 1) this.verifyCTe(ctesUnlinked[0]);
            // Verifica se não tem nenhuma CT-e não vinculada no GRID.
            if (ctesUnlinked.length === 0) {
              this.snackbar.open = true;
              this.snackbar.message = `CT-e já selecionada.`
              this.clearSearch();
            }
          } else {
            // Envia para verificação para ser vinculado no GRID o último CT-e retornado pelo backend (se forceSelect for true).
            const lastIndex: number = response.dados.items.length - 1;
            this.verifyCTe(response.dados.items[lastIndex])
          }
        } else {
          if (response.dados.items.length === 1) {
            const cteBack = response.dados.items[0];
            cteBack.dataEmissao = formatOnlyDateBack(cteBack.dataEmissao);
            cteBack.valorFrete = setCurrencyMask(cteBack.valorFrete);
            this.verifyCTe(cteBack)
          } else {
            this.snackbar.open = true;
            this.snackbar.message = response.dados.mensagem
          }
        }
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // // Modal para upload de CT-es em formato XML.
  // openModalUploadFiles() {
  //   const modalOptions: NgbModalOptions = {
  //     centered: true,
  //     modalDialogClass: 'modal-upload-files',
  //   };
  //   const modalRef = this.modalService.open(ModalUploadFilesComponent, modalOptions);

  //   modalRef.result
  //     .then(async (result: { status: 'success' | 'error', numInvoices: string[], xmlInvalid: string[] }) => {
  //       if (result.status === 'success') {
  //         // Faz a busca das NFs criadas a partir do XML para serem vinculadas à conferência.
  //         await Promise.all(result.numInvoices.map(numInvoice => {
  //           this.doSearch(numInvoice, true);
  //         }));

  //         // Envia o nomde dos arquivos XML que são inválidos
  //         // para a função que abre o modal de visualização de arquivos inválidos
  //         if (result.xmlInvalid.length >= 1) this.openModalInfoInvalidFile(result.xmlInvalid);
  //       }
  //     })
  //     .catch((res) => {

  //     })
  // }

  // // Modal para visualização de arquivos XML que não são CT-es.
  // openModalInfoInvalidFile(filesName: string[]) {
  //   const modalOptions: NgbModalOptions = {
  //     centered: true,
  //     modalDialogClass: 'modal-invalid-file',
  //   };
  //   const modalRef = this.modalService.open(ModalInvalidFileComponent, modalOptions);
  //   modalRef.componentInstance.files = filesName;

  //   modalRef.result
  //     .then((result) => {

  //     })
  //     .catch((res) => {

  //     })
  // }



  // Abre o modal para busca e seleção avançada de CT-e.
  openModalSearchResult(search: string) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalSearchResultCtesComponent, modalOptions);
    modalRef.componentInstance.search = search;
    modalRef.componentInstance.ctesLinked = this.ctes;
    modalRef.componentInstance.periodFilter = this.periodFilter;
    modalRef.componentInstance.filterDateSelected = this.filterDateSelected;
    modalRef.componentInstance.clientNameFilter = this.clientNameFilter;


    this.clearSearch();

    modalRef.result
      .then((result) => {
        if (result.length >= 1) {
          for (const cte of result) {
            this.verifyCTe(cte);
          }
        }
      })
      .catch((res) => {

      })
  }

  // Verifica se o CT-e encontrado já esta vinculada à fatura.
  verifyCTe(newCTe: any) {
    // Verifica se o CT-e já esta vinculado.
    let exist: boolean = false;
    this.ctes.forEach(cte => {
      if (cte.noCTRC === newCTe.noCTRC &&
        cte.cdEmpresa === newCTe.cdEmpresa &&
        cte.cdFilEmp === newCTe.cdFilEmp
      ) {
        exist = true;
      }
    });

    // Se o CT-e já estiver vinculado.
    if (exist) {
      this.snackbar.open = true;
      this.snackbar.message = `CT-e ${newCTe.conhecimento} já selecionada.`
    } else {
    // Se o CT-e não estiver vinculado.
      this.ctes.push(newCTe);

      let count = 0;
      for (const cte of this.ctes) {
        cte.id = count;
        count++;
      }
    }

    // Atualiza o GRID com o novo CT-e e limpa o campo de busca.
    setTimeout(() => {
      if (this.ctes.length >= 1) {
        this.tableComponent.updateDataset(this.ctes)
        this.ctesEmitter.emit(this.ctes);
      }
      this.clearSearch()
    }, 0);
  }

  // Limpa o campo de busca de CT-e.
  clearSearch() {
    this.InputSearchComponent.entry = '000';
    setTimeout(() => {
      this.InputSearchComponent.clear();
    }, 0);
  }

  // Realiza a verificação para a remoção do CT-e.
  goToDelete(data: any) {
    this.ctes.splice(this.ctes.indexOf(data), 1)
    this.tableComponent.updateDataset(this.ctes);
    this.ctesEmitter.emit(this.ctes);
  }

  verifyPermissionsToSearchCTe(): boolean {
    if (this.idBill && this.disableFields) return false;
    if (!this.idBill && !this.permissions.includes(this.authReceivable.Incluir)) return false;

    return true;
  }

}
