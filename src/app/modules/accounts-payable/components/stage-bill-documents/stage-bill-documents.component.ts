import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TableSimpleGridComponent } from 'src/app/modules/shared/components/tables/table-simple-grid/table-simple-grid.component';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ModalStageBillDocumentsComponent } from '../../modais/modal-stage-bill-documents/modal-stage-bill-documents.component';
import { ModalSearchResultCtesComponent } from 'src/app/modules/accounts-receivable/modais/modal-search-result-ctes/modal-search-result-ctes.component';




@Component({
  selector: 'app-stage-bill-documents',
  templateUrl: './stage-bill-documents.component.html',
  styleUrls: ['./stage-bill-documents.component.scss']
})
export class StageBillDocumentsComponent {
  documents: any[] = [];
  @Input() disableEdit: boolean = false;
  columns: ColumnSlickGrid[] = [];
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  maxHeightTable: string = '';
  @Output() ctesEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild(TableSimpleGridComponent) tableComponent!: TableSimpleGridComponent;

  constructor(private modalService: NgbModal){
    this.getColumns();
    this.getDocuments();
  }

  // Monta as colunas do GRID.
  getColumns() {
    this.columns = [
      { name: 'Número do documento', id: 'numeroDoDocumento', width: 150 },
      { name: 'Tipo de documento', id: 'tipoDeDocumento', width: 150 },
      { name: 'Data de Emissão', id: 'dataDeEmissao', width: 150 },
      { name: 'Fornecedor', id: 'fornecedor', width: 150 },
      { name: 'Valor', id: 'valor', width: 150 }
    ]
  }

  doSearch(){}

  //Recebe os documentos das faturas
  getDocuments(){
    this.documents = [
      {
        id: 1,
        numeroDoDocumento: '000000000010',
        tipoDeDocumento: 'Ordem de Combustível',
        dataDeEmissao: '25/05/2023',
        fornecedor: '79.992.193/0001-64 - Alberto Lopes Viana dos Santos',
        valor: 'R$10,00',
      },
      {
        id: 2,
        numeroDoDocumento: '000000000010',
        tipoDeDocumento: 'Ordem de Combustível',
        dataDeEmissao: '25/05/2023',
        fornecedor: '79.992.193/0001-64 - Alberto Lopes Viana dos Santos',
        valor: 'R$0,00',
      },
      {
        id: 3,
        numeroDoDocumento: '000000000010',
        tipoDeDocumento: 'Ordem de Combustível',
        dataDeEmissao: '25/05/2023',
        fornecedor: '79.992.193/0001-64 - Alberto Lopes Viana dos Santos',
        valor: 'R$0,00',
      },
      {
        id: 4,
        numeroDoDocumento: '000000000010',
        tipoDeDocumento: 'Ordem de Combustível',
        dataDeEmissao: '25/05/2023',
        fornecedor: '79.992.193/0001-64 - Alberto Lopes Viana dos Santos',
        valor: 'R$0,00',
      },
      {
        id: 5,
        numeroDoDocumento: '000000000010',
        tipoDeDocumento: 'Ordem de Combustível',
        dataDeEmissao: '25/05/2023',
        fornecedor: '79.992.193/0001-64 - Alberto Lopes Viana dos Santos',
        valor: 'R$0,00',
      },
    ]
  }

  // Realiza a verificação para a remoção do CT-e.
  goToDelete(data: any) {
    this.documents.splice(this.documents.indexOf(data), 1)
    this.tableComponent.updateDataset(this.documents);
    this.ctesEmitter.emit(this.documents);
  }

  //Abre o modal de pesquisa de resultado
  openModalSearchResult(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalStageBillDocumentsComponent, modalOptions);

  }
}
