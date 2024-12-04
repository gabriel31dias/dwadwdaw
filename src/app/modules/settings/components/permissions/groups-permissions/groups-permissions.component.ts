import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { PermissionService } from '../../../services/permission.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-groups-permissions',
  templateUrl: './groups-permissions.component.html',
  styleUrls: ['./groups-permissions.component.scss']
})
export class GroupsPermissionsComponent {

  companyId: string;
  search: string = '';
  columns: ColumnSlickGrid[] = [];
  groups: any [] = [];
  groupsSelected: any[] = [];
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  customHeight: number = 285;

  constructor(private router: Router,
    private permissionService: PermissionService,
    private storage: StorageService,
    private modalService: NgbModal
  ) {
    this.companyId = storage.getCompanyId()!;
    this.getHeaderTable()
    this.getGroups();
  }

  getHeaderTable() {
    this.columns = [
      { name: 'Grupo de permissões', id: 'nome', width: 100 },
    ]
  }

  setHeightTable() {
    const increment = 40;
    const maxHeight = 445;

    this.customHeight = 85;
    for (const group of this.groups) {
      if (this.customHeight < maxHeight) {
        this.customHeight += increment;
      }
    }
  }

  getGroups() {
    this.loading = true;
    this.groups = [];
    this.permissionService.getGroups(this.companyId, this.search).subscribe({
      next: (response) => {
        this.groups = response.dados;
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

  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.getGroups();
  }

  createNewGroup() {
    this.router.navigate(['settings/permissions/actions']);
  }

  goToEditGroup(group: any) {
    this.router.navigate(['settings/permissions/actions'], {
      queryParams: { number: group.id }
    })
  }

  rowsSelected(selected: any[]) {
    this.groupsSelected = [];
    this.groupsSelected = selected;
  }

  confirmDeleteGroup() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = this.groupsSelected.length <= 1 ? 'excluirGrupoPermissao' : 'excluirGruposPermissao';
    modalRef.componentInstance.text = this.groupsSelected.length <= 1 ? 'textoExcluirGrupoPermissao' : 'textoExcluirGruposPermissao';
    modalRef.componentInstance.style = 'red';
    modalRef.componentInstance.textBtnConfirm = 'excluir';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.deleteGroup()
      }
    })
    .catch((res) => {

    })
  }

  deleteGroup() {
    const idsGroup: number[] = this.groupsSelected.map(group => group.id);
    let completedRequests = 0;

    for (const idGroup of idsGroup) {
      this.callDeleteGroup(idGroup, () => {
        completedRequests++;
        if (completedRequests === idsGroup.length) {
          this.getGroups();
        }
      });
    }
  }

  callDeleteGroup(groupId: number, callback: () => void) {
    this.permissionService.deleteGroup(this.companyId, groupId).subscribe({
      next: (response) => {
        callback();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  verifyGroupsToDelte(): boolean {
    let canDelete: boolean = true;

    for (const group of this.groupsSelected) {
      if (group.contadorUsuarios !== null) canDelete = false;
    }

    return canDelete;
  }

}
