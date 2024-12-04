import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ModalIncludeNfComponent } from 'src/app/modules/shared/components/modais/modal-include-nf/modal-include-nf.component';
import { ModalSearchResultComponent } from 'src/app/modules/shared/components/modais/modal-search-result/modal-search-result.component';
import { InputSearchComponent } from 'src/app/modules/shared/components/inputs/input-search/input-search.component';
import { ModalUploadFilesComponent } from 'src/app/modules/shared/components/modais/modal-upload-files/modal-upload-files.component';
import { TableSimpleGridComponent } from 'src/app/modules/shared/components/tables/table-simple-grid/table-simple-grid.component';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { EtapaNotasFiscais } from '../../models/invoices.model';
import { ConferenceService } from '../../services/conference.service';
import { ModalInvalidFileComponent } from 'src/app/modules/shared/components/modais/modal-invalid-file/modal-invalid-file.component';
import { DetailTypeConference } from '../../models/detail-type-conference.model';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';
import { setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { NovaNotaFiscal } from 'src/app/modules/shared/models/new-invoice.model';

@Component({
  selector: 'app-stage-invoices',
  templateUrl: './stage-invoices.component.html',
  styleUrls: ['./stage-invoices.component.scss']
})
export class StageInvoicesComponent implements OnChanges {

  companyId: string;
  permissions: string [] = [];
  authConference = ConferenciaPermissoes;
  nConference: string = '';
  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  count: number = 0;
  loading: boolean = false;
  @Input() typesConference: DetailTypeConference[] = [];
  @Input() typesConferenceName: string[] = [];
  @ViewChild(TableSimpleGridComponent) tableComponent!: TableSimpleGridComponent;
  @ViewChild(InputSearchComponent) InputSearchComponent!: InputSearchComponent;
  snackbar: Snackbar = new Snackbar();
  @Input() nfs: any[] = [];
  @Input() invoices: EtapaNotasFiscais = <EtapaNotasFiscais>{};
  @Output() invoicesEmitter = new EventEmitter<EtapaNotasFiscais>();
  readonly: boolean = true;
  @Input() alertRequired: boolean = false;
  gridUpdated: boolean = true;
  @Output() updateConference = new EventEmitter<any>();
  @Output() updateGrid = new EventEmitter<any>();
  @Input() currentStatus: number = 0;

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private conferenceService: ConferenceService,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.nConference = queryParams['number'];
      } else {
        setTimeout(() => {
          this.getDateTime()
        }, 0);
      }
    })

    this.getHeaderTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.invoices.nfs = this.nfs;
    this.invoicesEmitter.emit(this.invoices)

    if (this.nConference) {
      this.gridUpdated = false;
      setTimeout(() => {
        this.gridUpdated = true
      }, 0);
    }
  }

  // Busca a data e hora atual.
  getDateTime() {
    if (!this.nConference) {
      const dateNow = new Date();

      const day = dateNow.getDate().toString().padStart(2, '0');
      const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
      const year = dateNow.getFullYear();
      const hours = dateNow.getHours().toString().padStart(2, '0');
      const minutes = dateNow.getMinutes().toString().padStart(2, '0');
      const seconds = dateNow.getSeconds().toString().padStart(2, '0');

      this.invoices.data = `${day}/${month}/${year}`;
      this.invoices.horarioInclusao = `${hours}:${minutes}:${seconds}`;
    }
  }

  // Monta as colunas do GRID.
  getHeaderTable() {
    this.columns = [
      { name: 'Nota fiscal', id: 'nf', width: 150 },
      { name: 'Série', id: 'serie', width: 150 },
      { name: 'Data de emissão', id: 'dtEmissaoTratado', width: 150 },
      { name: 'Pedido', id: 'noPedido', width: 150 },
      { name: 'Romaneio', id: 'noRomaneio', width: 150 },
      { name: 'Qtde. de volumes', id: 'qtdVolumes', width: 150 },
      { name: 'Qtde. de etiquetas', id: 'qtdEtiqueta', width: 150 },
      { name: 'Peso', id: 'peso', width: 150 },
      { name: 'Peso bruto', id: 'pesoCalc', width: 150 },
      { name: 'M³', id: 'volM3', width: 150 },
      { name: 'Valor mercadoria', id: 'valor', width: 150 },
    ]
  }

  // Faz a busca da NF e vincula à conferência.
  doSearch(search: string, forceSelect?: boolean) {
    if (!search) return;

    this.loading = true;
    this.conferenceService.getInvoices(this.companyId, search).subscribe({
      next: (response) => {
        if (response.dados.length > 1) {
          if (forceSelect) {
            const lastIndex: number = response.dados.length - 1;
            this.verifyInvoice(response.dados[lastIndex])
          } else {
            this.openModalSearchNf(response.dados);
          }
        } else {
          if (response.dados.length === 1) {
            this.verifyInvoice(response.dados[0])
          } else {
            this.snackbar.open = true;
            this.snackbar.message = 'notaFiscalNaoEncontrada'
          }
        }
        this.loading = false;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.loading = false;
      }
    })
  }

  // Chama a função que abre o modal para inclusão/edição de NF.
  goToEdit(invoice: any) {
    this.openModalIncludeNF(invoice);
  }

  // Remove a NF selecionada no GRID.
  goToDelete(data: any) {
    this.nfs.splice(this.nfs.indexOf(data), 1)
    this.tableComponent.updateDataset(this.nfs);
  }

  // Modal no qual o usuário seleciona a NF que deseja incluir na conferência quando a busca retorna mais de 1 NF.
  openModalSearchNf(nfsFound: any[]) {
    let countFound = 0;
    for (const nf of nfsFound) {
      nf.id = countFound
      countFound++;
    }
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalSearchResultComponent, modalOptions);
    modalRef.componentInstance.data = nfsFound;
    modalRef.componentInstance.columns = this.columns;
    modalRef.componentInstance.text = `A pesquisa encontrou ${nfsFound.length} notas ficais com o mesmo número, selecione abaixo qual você deseja.`

    modalRef.result.then((result: any) => {
      if (result) {
        this.verifyInvoice(result)
        setTimeout(() => {
          this.tableComponent.updateDataset(this.nfs);

          this.InputSearchComponent.entry = '000';
          setTimeout(() => {
            this.InputSearchComponent.clear();
          }, 0);
        }, 0);
      }
    })
  }

  // Modal para inclusão/edição de NF manual.
  openModalIncludeNF(invoice?: any) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-include-nf',
    };
    const modalRef = this.modalService.open(ModalIncludeNfComponent, modalOptions);
    modalRef.componentInstance.enableInputTag = true;
    modalRef.componentInstance.nConference = this.nConference;
    invoice.noNf ? modalRef.componentInstance.idInvoice = invoice.noNf : null;
    modalRef.componentInstance.cdFilial = invoice.cdFilEmp;

    modalRef.result
      .then((response: { type: 'create' | 'update', search: string | null, noNf?: number, invoice: NovaNotaFiscal }) => {
        if (response.type === 'create') {
          this.snackbar.open = true;
          this.snackbar.message = 'notaFiscalIncluida'

          this.doSearch(response.search!)
        }

        if (response.type === 'update') {
          this.snackbar.open = true;
          this.snackbar.message = 'notaFiscalEditada';

          if (!this.nConference) {
            this.nfs.splice(this.nfs.findIndex(nf => nf.noNf == response.noNf), 1)
            this.tableComponent.updateDataset(this.nfs);

            this.doSearch(response.search!);
          } else {
            this.updateGrid.emit();
          }

        }
      })
      .catch((response) => {

      })
  }

  // Modal para upload de NFs em formato XML.
  openModalUploadFiles() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-upload-files',
    };
    const modalRef = this.modalService.open(ModalUploadFilesComponent, modalOptions);

    modalRef.result
      .then(async (result: { status: 'success' | 'error', numInvoices: string[], xmlInvalid: string[] }) => {
        if (result.status === 'success') {
          // Faz a busca das NFs criadas a partir do XML para serem vinculadas à conferência.
          await Promise.all(result.numInvoices.map(numInvoice => {
            this.doSearch(numInvoice, true);
          }));

          // Envia o nomde dos arquivos XML que são inválidos
          // para a função que abre o modal de visualização de arquivos inválidos
          if (result.xmlInvalid.length >= 1) this.openModalInfoInvalidFile(result.xmlInvalid);
        }
      })
      .catch((res) => {

      })
  }

  // Modal para visualização de arquivos XML que não são NFs.
  openModalInfoInvalidFile(filesName: string[]) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-invalid-file',
    };
    const modalRef = this.modalService.open(ModalInvalidFileComponent, modalOptions);
    modalRef.componentInstance.files = filesName;

    modalRef.result
      .then((result) => {

      })
      .catch((res) => {

      })
  }

  // Verifica se a NF encontrad já esta vinculada à conferência.
  verifyInvoice(newInvoice: any) {
    let exist: boolean = false;

    this.nfs.forEach(invoice => {
      if (invoice.noNf === newInvoice.noNf &&
        invoice.cdEmpresa === newInvoice.cdEmpresa &&
        invoice.cdFilEmp === newInvoice.cdFilEmp
      ) {
        exist = true;
      }
    });

    if (exist) {
      this.snackbar.open = true;
      this.snackbar.message = 'notaFiscalJaSelecionada'
    } else {
      newInvoice.peso ? newInvoice.peso = newInvoice.peso.toLocaleString('pt-BR') : null;
      newInvoice.pesoCalc ? newInvoice.pesoCalc = newInvoice.pesoCalc.toLocaleString('pt-BR') : null;
      newInvoice.volM3 ? newInvoice.volM3 = newInvoice.volM3.toLocaleString('pt-BR') : null;
      newInvoice.valor = setCurrencyMask(newInvoice.valor);
      this.nfs.push(newInvoice)

      if (this.nConference) {
        this.updateConference.emit();
      }

      this.count = 0;
      for (const nf of this.nfs) {
        nf.id = this.count;
        this.count++;
      }

      setTimeout(() => {
        if (this.nfs.length >= 1) { this.tableComponent.updateDataset(this.nfs) }

        this.InputSearchComponent.entry = '000';
        setTimeout(() => {
          this.InputSearchComponent.clear();
        }, 0);
      }, 0);
    }
  }

  // Salva em this.invoices.tpConferencia o id do tipo de conferência selecionado.
  setTypeConference(index: number | null) {
    if (index === null) return;

    const nameTypeSelected = this.typesConferenceName[index];
    for (const type of this.typesConference) {
      if (type.descricao === nameTypeSelected) this.invoices.tpConferencia = type.idConferenciaTipo;
    }
  }

  // Verifica qual é o nome do tipo da conferência de acordo com o id selecionado.
  getTypeConference(typeId: number): string | null {
    for (const type of this.typesConference) {
      if (type.idConferenciaTipo === typeId) {
        return type.descricao;
      }
    }

    return null;
  }

}
