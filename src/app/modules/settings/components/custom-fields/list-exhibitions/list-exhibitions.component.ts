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
  selector: 'app-list-exhibitions',
  templateUrl: './list-exhibitions.component.html',
  styleUrls: ['./list-exhibitions.component.scss']
})
export class ListExhibitionsComponent  {

  companyId: string;
  search: string = '';
  columns: ColumnSlickGrid[] = [];
  exhibitions: any [] = [];
  exhibitionsSelected: any[] = [];
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  customHeight: number = 285;
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];
  @ViewChild(TableSimpleGridComponent) table!: TableSimpleGridComponent;
  showDelete: boolean = false;

  constructor(private router: Router,
    private storage: StorageService,
    private modalService: NgbModal,
    private customFieldService: CustomFieldService
  ) {
    this.companyId = storage.getCompanyId()!;
    this.getHeaderTable();
    this.loadExhibitions();
    this.getColumnsFilter();
  }

  // Monta o hearder da tabela (slickgrid).
  getHeaderTable() {
    this.columns = [
      { name: 'Código', id: 'codigo', width: 100 },
      { name: 'Nome', id: 'nome', width: 100 },
      { name: 'Tela', id: 'tela', width: 100 },
      { name: 'Habilitado', id: 'habilitado', width: 100 },
    ]
  }

  // Define a altura da tabela (slickgrid).
  setHeightTable() {
    const increment = 40;
    const maxHeight = 445;

    this.customHeight = 85;
    for (const customField of this.exhibitions) {
      if (this.customHeight < maxHeight) {
        this.customHeight += increment;
      }
    }
  }

  // Trás as opções de colunas para o filtro dinâmico.
  getColumnsFilter() {
    this.loading = true;
    this.customFieldService.getEhxibitionFilters(this.companyId).subscribe({
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

  // Grava a escolha de filtro avançado e realiza a busca de exibições com base nele.
  setFilterColumn(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.loadExhibitions();
  }

  // Realiza a busca das exibições refrente ao dado que o usuário inserir no campo de busca.
  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.loadExhibitions();
  }

  // Direciona para tela de cadastro de nova exibição.
  createNewExhibition() {
    this.router.navigate(['settings/exhibitions/actions']);
  }

  // Direciona para tela de edição de exibição.
  goToEditExhibition(exhibition: any) {
    this.router.navigate(['settings/exhibitions/actions'], {
      queryParams: { number: exhibition.codigo }
    })
  }

  // Grava os registros que foram selecionados pelo usuário (slickgrid).
  rowsSelected(selected: any[]) {
    this.exhibitionsSelected = [];
    this.exhibitionsSelected = selected;
  }

  // Abre o modal de confirmação de deleção de exibição.
  confirmDeleteExhibition() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = this.exhibitionsSelected.length <= 1
      ? 'excluirExibicao'
      : 'excluirExibicoes';
    modalRef.componentInstance.text = this.exhibitionsSelected.length <= 1
      ? 'textoExcluirExibicao'
      : 'textoExcluirExibicoes';
    modalRef.componentInstance.style = 'red';
    modalRef.componentInstance.textBtnConfirm = 'excluir';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.deleteExhibitions()
      }
    })
    .catch((res) => {

    })
  }

  // Realiza a deleção das exibições selecionadas.
  deleteExhibitions() {
    const idsExhibitions: number[] = this.exhibitionsSelected.map(exhibition => exhibition.codigo);
    for (const exhibitionId of idsExhibitions) {
      this.callDeleteExhibitions(exhibitionId);
    }
  }

  // Chama o método do service que realiza a deleção das exibições.
  callDeleteExhibitions(exhibitionId: number) {
    this.loading = true;
    this.customFieldService.deleteExhibition(this.companyId, exhibitionId).subscribe({
      next: (res) => {
        this.loading = false;
        this.exhibitionsSelected = this.exhibitionsSelected.filter(exhibition => exhibition.codigo !== exhibitionId);
        this.loadExhibitions();
      },
      error: (res) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = res.error.mensagem;
        this.snackbar.errorHandling = res.error.tratamentoErro;
      }
    })
  }

  changeStatusField(action: 'Habilitar' | 'Desabilitar') {
    this.loading = true;
    const ids: number[] = [];
    for (const field of this.exhibitionsSelected) {
      ids.push(field.id);
    }
    this.customFieldService.changeStatusExhibition(this.companyId, ids, action).subscribe({
      next: (response) => {
        this.loading = false;
        this.loadExhibitions();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  loadExhibitions(keepSelecteds?: boolean) {
    this.loading = true;
    if (!keepSelecteds && this.exhibitionsSelected.length >= 1) {
      this.table.unselectAll();
    }

    this.customFieldService.getGridExibition(this.companyId, this.search, this.filterColumnSelected).subscribe({
      next: (res) => {
        this.exhibitions = []
        this.exhibitions = res.dados.items;
        for (const item of this.exhibitions) {
          item.id = item.id;
          item.codigo = item.id;
          item.nome = item.nome;
          item.tela = item.modulo;
          item.habilitado = item.habilitado ? 'Habilitado' : 'Desabilitado';
        }

        this.setHeightTable();
        this.loading = false;
      },
      error: (res) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = res.error.mensagem;
        this.snackbar.errorHandling = res.error.tratamentoErro;
      }
    })
  }

  verifySameStatusSelected(): boolean {
    if (this.exhibitionsSelected.length === 0) {
      return false;
    }

    const firstStatus = this.exhibitionsSelected[0].habilitado;
    for (let i = 1; i < this.exhibitionsSelected.length; i++) {
      if (this.exhibitionsSelected[i].habilitado !== firstStatus) {
        return false;
      }
    }
    return true;
  }

  verifyStatusDelete(): boolean {
    if (this.exhibitionsSelected.length === 0) {
      return false;
    } else {
      for (let i = 0; i < this.exhibitionsSelected.length; i++) {
        if (!this.exhibitionsSelected[i].permiteExclusao) {
          return false;
        }
      }
    }
    return true;
  }

}
