import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { NotaFiscal, NotaFiscalGrid } from 'src/app/modules/shared/models/nota-fiscal.model';
import { setDefaultViewGrid } from 'src/app/modules/shared/utils/grid-utils';
import { defaultViewGridGMSelectionNF } from 'src/app/modules/shared/consts/default-view-grid.const';
import { configGMSelectionNF } from 'src/app/modules/shared/consts/columns-gm-selection-nf.const';
import { ModalConfirmationComponent } from '../../../modais/modal-confirmation/modal-confirmation.component';
import { ModalActionsNfComponent } from '../modal-actions-nf/modal-actions-nf.component';
import { ModalUploadNfComponent } from '../modal-upload-nf/modal-upload-nf.component';
import { ModalSearchNfComponent } from '../modal-search-nf/modal-search-nf.component';
import { NotaFiscalService } from 'src/app/modules/shared/services/nota-fiscal.service';
import { ParamsGrid } from 'src/app/modules/shared/models/params-grid.model';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { TableGridSecondaryComponent } from '../../../tables/table-grid-secondary/table-grid-secondary.component';
import { InputSearchComponent } from '../../../inputs/input-search/input-search.component';
import { formatterGridToNFArray, formatterNFToGridArray, formatterNFToGridObject } from 'src/app/modules/shared/utils/nota-fiscal.utils';
import { ModalInvalidFileComponent } from '../../../modais/modal-invalid-file/modal-invalid-file.component';
import { ModalSelectNfComponent } from '../modal-select-nf/modal-select-nf.component';

@Component({
  selector: 'app-gm-selection-nf',
  templateUrl: './gm-selection-nf.component.html',
  styleUrls: ['./gm-selection-nf.component.scss']
})
export class GmSelectionNfComponent implements OnInit {

  companyId: string;
  @Input() readonly?: boolean = false;
  nfs: NotaFiscalGrid[] = [];
  @Input() setNFs: NotaFiscal[] = [];
  @Output() getNFs: EventEmitter<NotaFiscal[]> = new EventEmitter<NotaFiscal[]>();
  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  search: string = '';
  nfsSelected: NotaFiscalGrid[] = [];
  @ViewChild(TableGridSecondaryComponent) GridComponent!: TableGridSecondaryComponent;
  @ViewChild(InputSearchComponent) InputSearchComponent!: InputSearchComponent;

  /** Construtor da classe `GmSelectionNfComponent`.
   * @param translateService Service responsável pela tradução do sistema.
   * @param modalService Service responsável para a chamada dos modais.
   * @param storageService Service responsável para buscar e inserir dados no Storage.
  */
  constructor(private translateService: TranslateService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private notaFiscalService: NotaFiscalService
  ) {
    this.translateService.use('pt-br');
    this.companyId = this.storageService.getCompanyId()!;
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    this.initGrid();

    const newNFs: NotaFiscalGrid[] = formatterNFToGridArray(this.setNFs);
    this.verifyInvoice(newNFs, true, true);
  }

  /** Monta o GRID com base nas configurações salvas no armazenamento do usuário ou utiliza as
    * configurações padrão caso não haja nenhuma configuração salva. */
  initGrid() {
    const gridConfig = localStorage.getItem('gridGMSelectionNF');
    const hideConfig = localStorage.getItem('hideGMSelectionNF');
    if (gridConfig === null && hideConfig === null) {
      this.columns = configGMSelectionNF;
      this.columnsHide = setDefaultViewGrid(defaultViewGridGMSelectionNF, this.columns);
    } else {
      this.columns = this.storageService.getConfigGrid('gridGMSelectionNF');
      this.columnsHide = this.storageService.getHideGridColumns('hideGMSelectionNF');
    }
  }

  /** Faz a busca da nota e vincula ela ao GRID.
   * @param search Campo de busca.
  */
  doSearch(search: string) {
    this.loading = true;
    const params: ParamsGrid = {
      pagina: 1,
      quantidade: 5,
      busca: search,
      filtros: [],
      status: null,
      tipo_data: null,
      data_inicial: null,
      data_final: null,
    }

    this.notaFiscalService.getGridSearchNF(this.companyId, params).subscribe({
      next: (response) => {
        this.loading = false;
        const nfsAPI = response.dados;

        if (
          response.dados &&
          response.dados.length > 0 &&
          response.dados[0].outros_dados &&
          response.dados[0].outros_dados.validade_sefaz
        ) {
          alert('dados sefaz')
          this.openModalSelectNf('effe')
        }

        if (nfsAPI.length > 1) {
          this.openModalSearchNf(search);
        } else {
          const invoiceFormatted: NotaFiscalGrid = formatterNFToGridObject(nfsAPI[0]);
          this.verifyInvoice([invoiceFormatted]);
        }
      },
      error: (response) => {
        this.nfs = [];
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
        this.loading = false;
      },
    })

  }

  /** Modal de busca de NF.
   * @param search Campo de busca a ser iniciado como filtro no modal de busca.
  */
  openModalSearchNf(search: string) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-nf',
    };
    const modalRef = this.modalService.open(ModalSearchNfComponent, modalOptions);
    modalRef.componentInstance.search = search;

    modalRef.result.then((nfs: NotaFiscalGrid[]) => {
      if (nfs.length >= 1) {
        const newNFs: NotaFiscalGrid[] = nfs;
        this.verifyInvoice(newNFs, true);
      }
    })
    .catch((res) => {

    })
  }

    /** Modal de busca de NF.
   * @param search Campo de busca a ser iniciado como filtro no modal de busca.
  */
    openModalSelectNf(search: string) {
      const modalOptions: NgbModalOptions = {
        centered: true,
        modalDialogClass: 'modal-select-nf',
      };
      const modalRef = this.modalService.open(ModalSelectNfComponent, modalOptions);
      modalRef.componentInstance.search = search;
  
      modalRef.result.then((nfs: NotaFiscalGrid[]) => {
        if (nfs.length >= 1) {
          const newNFs: NotaFiscalGrid[] = nfs;
          this.verifyInvoice(newNFs, true);
        }
      })
      .catch((res) => {
  
      })
    }

  /** Abre o modal de inclusão/edição de NF. */
  openModalActionsNF() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-include-nf',
    };
    const modalRef = this.modalService.open(ModalActionsNfComponent, modalOptions);
  }

  /** Abre o modal de Upload de NFs em XML. */
  openModalUploadFiles() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-upload-files',
    };
    const modalRef = this.modalService.open(ModalUploadNfComponent, modalOptions);

    modalRef.result.then((response: { status: string, nfs: NotaFiscalGrid[], xmlInvalid: string[] }) => {
      if (response.status === 'success') {
        if (response.nfs.length >= 1) {
          const nfs: NotaFiscalGrid[] = response.nfs;
          this.verifyInvoice(nfs, true);
        }

        if (response.xmlInvalid.length >= 1) {
          this.openModalInfoInvalidFile(response.xmlInvalid)
        }
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de Upload de NFs em XML.
   * @param filesName Nome dos arquivos que são invlálidos (Não são notas fiscais).
  */
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

  /** Abre o modal de confirmação de remoção de NF do GRID. */
  openModalConfirmRemove() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions)
    modalRef.componentInstance.title = this.nfsSelected.length <= 1 ? 'removerNF' : 'removerNFs';
    modalRef.componentInstance.text = this.nfsSelected.length <= 1 ? 'textoRemoverNF' : 'textoRemoverNFs';
    modalRef.componentInstance.style = 'red';
    modalRef.componentInstance.textBtnConfirm = 'remover';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.removeNF();
      }
    })
    .catch((res) => {

    })
  }

  /** Remove as notas fiscais selecionadas do GRID. */
  removeNF() {
    this.nfs = this.nfs.filter((nf: NotaFiscalGrid) =>
      !this.nfsSelected.some(selected => selected.id === nf.id
    ));
    this.nfsSelected = [];

    this.getNFs.emit(formatterGridToNFArray(this.nfs));
  }

  /** Verifica se a NF já se encontra vinculada ao GRID.
   * @param newNFs Lista de notas fiscais a serem vinculadas no GRID.
   * @param noMessage Flag para não exibir a mensagem de Nota fiscal não encontrada. `(Não obrigatório)`
  */
  verifyInvoice(newNFs: NotaFiscalGrid[], noMessage?: boolean, noEmit?: boolean) {
    if (newNFs.length === 0) return;

    for (const newNF of newNFs) {
      const exist: boolean = this.nfs.some((nf: NotaFiscalGrid) =>
        nf.codigo === newNF.codigo
      )

      if (exist) {
        if (!noMessage && newNFs.length === 1) {
          this.snackbar.open = true;
          this.snackbar.message = `Nota fiscal ${newNF.numero} já selecionada.`;
          this.snackbar.type = SnackbarType.Default;
          this.clearSearchAndUpdateGrid();
          return;
        }
      } else {
        newNF.id = this.nfs.length;
        this.nfs.push(newNF);
      }
    }
    this.clearSearchAndUpdateGrid();

    if (!noEmit) this.getNFs.emit(formatterGridToNFArray(this.nfs));
  }

  /** Limpa o campo de busca por chave de acesso e atualiza o GRID. */
  clearSearchAndUpdateGrid() {
    setTimeout(() => {
      this.GridComponent.updateDataset(this.nfs);
      this.InputSearchComponent.entry = ' ';
      setTimeout(() => {
        this.InputSearchComponent.clear();
      }, 1);
    }, 1);
  }

  /** Salva em `nfsSelected` as NFs que foram selecionadas pelo usuário no GRID.
   * @param nfsSelected Notas fiscais selecionadas no SlickGrid.
  */
  rowsSelected(nfsSelected: NotaFiscalGrid[]) {
    this.nfsSelected = nfsSelected;
  }

  /** Reseta o GRID para a configuração padrão. */
  resetGrid() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = 'titleRestaurarGrid';
    modalRef.componentInstance.text = 'textRestaurarGrid';
    modalRef.componentInstance.style = 'green';
    modalRef.componentInstance.textBtnConfirm = 'restaurar';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.nfs = [];
        localStorage.removeItem('gridGMSelectionNF');
        localStorage.removeItem('hideGMSelectionNF');
        this.initGrid();
      }
    })
    .catch((res) => {

    })
  }

  /** Verifica e salva as configurações de exibição do GRID (SlickGrid) no storage.
   * @param event Informações de configurações do GRID retornado pelo SlickGrid.
  */
  columnsChanges(event: any) {
    const allIds: string[] = [];
    const showIds: string[] = [];
    const configColumns: ColumnSlickGrid[] = [];

    for (const column of this.columns) {
      allIds.push(column.id)
    }

    for (const column of event) {
      if (column.columnId != "_checkbox_selector") {
        showIds.push(column.columnId)
        configColumns.push({ name: '', id: column.columnId, width: column.width })
      }
    }

    for (const column of configColumns) {
      const foundColumn = this.columns.find((c: any) => c.id === column.id);
      if (foundColumn) {
        column.name = foundColumn.name;
      }
    }

    this.columns.forEach((column) => {
      if (!configColumns.some((configColumn) => configColumn.id === column.id)) {
        configColumns.splice(this.columns.indexOf(column), 0, column)
      }
    })

    this.columnsHide = this.compareArrays(allIds, showIds);

    this.storageService.setConfigGrid(configColumns, 'gridGMSelectionNF')
    this.storageService.setHideGridColumns(this.columnsHide, 'hideGMSelectionNF')
  }

  /** Realiza a comparação de 2 arrays e retorna registros que tem diferença de um para o outro.
   * @param array1 Array 1 para comparação.
   * @param array2 Array 2 para comparação.
   * @returns Retorna uma listagem de valores que estão presentes no Array 1 e não estão presentes no Array 2.
  */
  compareArrays(array1: string[], array2: string[]) {
    const diferentIndex: string[] = [];

    array1.forEach((element) => {
      if (!array2.includes(element)) {
        diferentIndex.push(element)
      }
    })

    return diferentIndex ? diferentIndex : [];
  }

}
