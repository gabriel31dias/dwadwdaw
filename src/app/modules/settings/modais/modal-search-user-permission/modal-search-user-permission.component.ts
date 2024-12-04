import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { PermissionService } from '../../services/permission.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';

@Component({
  selector: 'app-modal-search-user-permission',
  templateUrl: './modal-search-user-permission.component.html',
  styleUrls: ['./modal-search-user-permission.component.scss'],
})
export class ModalSearchUserPermissionComponent {

  companyId: string;
  searchText: string = '';
  columns: ColumnSlickGrid[] = [];
  users: any[] = [];
  dataSelected: any;
  columnsHide: string[] = [];
  loading: boolean = false;
  customHeight: number = 285;
  snackbar: Snackbar = new Snackbar();
  usersSelecteds: any[] = [];

  constructor(
    private modal: NgbActiveModal,
    private translate: TranslateService,
    private permissionService: PermissionService,
    private storage: StorageService
  ) {
    this.companyId = storage.getCompanyId()!;
    translate.use('pt-br');
    this.getHeaderTable();
    this.searchUser(this.searchText);
  }

  getHeaderTable() {
    this.columns = [
      { name: 'Usuários', id: 'nome', width: 100 },
      { name: 'E-mail', id: 'email', width: 100 },
      { name: 'Departamento', id: 'departamento', width: 100 },
    ]
  }

  setHeightTable() {
    if (this.users.length === 0) this.customHeight = 85;
    if (this.users.length === 1) this.customHeight = 125;
    if (this.users.length === 2) this.customHeight = 165;
    if (this.users.length === 3) this.customHeight = 205;
    if (this.users.length === 4) this.customHeight = 245;
    if (this.users.length >= 5) this.customHeight = 285;
  }

  searchUser(search: string) {
    this.loading = true;
    this.users = [];

    this.permissionService.getUsers(this.companyId, search).subscribe({
      next: (response) => {
        this.users = response.dados;

        const usersIdSelecteds = this.usersSelecteds.map(user => user.email);
        this.users = this.users.filter(userObj => !usersIdSelecteds.includes(userObj.email));

        let count = 0;
        for (const user of this.users) {
          user.id = count;
          count++;
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

  close() {
    this.modal.close();
  }

  getDataSelected(selectedRow: any) {
    this.dataSelected = selectedRow;
  }

  confirmSelected() {
    this.modal.close(this.dataSelected);
  }
}
