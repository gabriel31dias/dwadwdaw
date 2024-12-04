import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from 'src/app/modules/shared/models/filter-column.model';
import { AdvancedFilter } from 'src/app/modules/shared/models/save-filters.model';
import { CustomFieldService } from '../../../services/custom-field.service';
import { TableSimpleGridComponent } from 'src/app/modules/shared/components/tables/table-simple-grid/table-simple-grid.component';

@Component({
  selector: 'app-list-custom-fields',
  templateUrl: './list-custom-fields.component.html',
  styleUrls: ['./list-custom-fields.component.scss']
})
export class ListCustomFieldsComponent {

  companyId: string;
  search: string = '';
  columns: ColumnSlickGrid[] = [];
  customFields: any [] = [];
  customFieldsSelected: any[] = [];
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  customHeight: number = 285;
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];
  @ViewChild(TableSimpleGridComponent) table!: TableSimpleGridComponent;

  constructor(private router: Router,
    private storage: StorageService,
    private modalService: NgbModal,
    private customFieldService: CustomFieldService
  ) {
    this.companyId = storage.getCompanyId()!;
    this.getHeaderTable()
    this.getColumnsFilter();
    this.getCustomFields();
  }

  // Monta o hearder da tabela (slickgrid).
  getHeaderTable() {
    this.columns = [
      { name: 'Código', id: 'codigo', width: 100 },
      { name: 'Nome', id: 'nome', width: 100 },
      { name: 'Tipo', id: 'tipo', width: 100 },
      { name: 'Habilitado', id: 'habilitado', width: 100 },
    ]
  }

  // Define a altura da tabela (slickgrid).
  setHeightTable() {
    const increment = 40;
    const maxHeight = 445;

    this.customHeight = 85;
    for (const customField of this.customFields) {
      if (this.customHeight < maxHeight) {
        this.customHeight += increment;
      }
    }
  }

  // Trás as opções de colunas para o filtro dinâmico.
  getColumnsFilter() {
    this.customFieldService.getColumnsFilter(this.companyId).subscribe({
      next: (response) => {
        this.columnsFilter = response.dados;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca dos campos personalizados.
  getCustomFields(keepSelecteds?: boolean) {
    this.loading = true;
    if (!keepSelecteds && this.customFieldsSelected.length >= 1) {
      this.table.unselectAll();
    }

    this.customFieldService.getCustomFields(this.companyId, this.search, this.filterColumnSelected).subscribe({
      next: (response) => {
        this.customFields = [];
        this.customFields = response.dados.items;
        for (const field of this.customFields) {
          field.id = field.codigo;
          field.habilitado = field.habilitado ? 'Habilitado' : 'Desabilitado';
        }

        this.setHeightTable();
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

  // Grava a escolha de filtro avançado e realiza a busca de campos personalizados com base nele.
  setFilterColumn(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.getCustomFields();
  }

  // Realiza a busca dos campos personalizados refrente ao dado que o usuário inserir no campo de busca.
  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.getCustomFields();
  }

  // Direciona para tela de cadastro de novo campo personalizado.
  createNewCustomField() {
    this.router.navigate(['settings/custom-fields/actions']);
  }

  // Direciona para tela de edição de campo personalizado.
  goToEditField(field: any) {
    this.router.navigate(['settings/custom-fields/actions'], {
      queryParams: { number: field.id }
    })
  }

  // Grava os registros que foram selecionados pelo usuário (slickgrid).
  rowsSelected(selected: any[]) {
    this.customFieldsSelected = [];
    this.customFieldsSelected = selected;
  }

  // Abre o modal de confirmação de deleção de campo personalizado.
  confirmDeleteField() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = this.customFieldsSelected.length <= 1 ? 'excluirCampoPersonalizado' : 'excluirCamposPersonalizados';
    modalRef.componentInstance.text = this.customFieldsSelected.length <= 1 ? 'textoExcluirCampoPersonalizado' : 'textoExcluirCamposPersonalizados';
    modalRef.componentInstance.style = 'red';
    modalRef.componentInstance.textBtnConfirm = 'excluir';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.deleteField()
      }
    })
    .catch((res) => {

    })
  }

  // Realiza a deleção dos campos personalizados selecionados.
  deleteField() {
    const idsFields: number[] = this.customFieldsSelected.map(field => field.id);
    for (const fieldId of idsFields) {
      this.callDeleteCustomField(fieldId);
    }
  }

  // Chama o método do service que realiza a deleção dos campos personalizados.
  callDeleteCustomField(fieldId: number) {
    this.loading = true;
    this.customFieldService.deleteField(this.companyId, fieldId).subscribe({
      next: (response) => {
        this.loading = false;
        this.customFieldsSelected = this.customFieldsSelected.filter(field => field.id !== fieldId);
        this.getCustomFields(true);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  // Verifica o status dos itens selecionados de acordo com o parâmetro passado.
  verifyFieldToChangeStatus(status: 'Habilitado' | 'Desabilitado'): boolean {
    for (const field of this.customFieldsSelected) {
      if (field.habilitado === status) {
        return false;
      }
    }

    return true;
  }

  // Verifica se os items selecionados apresentam o mesmo status.
  verifySameStatusSelected(): boolean {
    if (this.customFieldsSelected.length === 0) {
      return false;
    }

    const firstStatus = this.customFieldsSelected[0].habilitado;
    for (let i = 1; i < this.customFieldsSelected.length; i++) {
      if (this.customFieldsSelected[i].habilitado !== firstStatus) {
        return false;
      }
    }

    return true;
  }

  // Verifica se é permitido excluir os itens selecionados.
  verifyToDelete(): boolean {
    for (const field of this.customFieldsSelected) {
      if (!field.permiteExclusao) return false;
    }

    return true;
  }

  // Habilita/Desabilita o campo personalizado selecionado.
  changeStatusField(action: 'Habilitar' | 'Desabilitar') {
    this.loading = true;
    const ids: number[] = [];
    for (const field of this.customFieldsSelected) {
      ids.push(field.id);
    }
    this.customFieldService.changeStatus(this.companyId, ids, action).subscribe({
      next: (response) => {
        this.loading = false;
        this.getCustomFields();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

}
