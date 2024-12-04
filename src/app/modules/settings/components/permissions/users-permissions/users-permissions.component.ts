import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ModalActiveUserComponent } from '../../../modais/modal-active-user/modal-active-user.component';
import { ModalDeleteUserComponent } from '../../../modais/modal-delete-user/modal-delete-user.component';
import { ModalDisableUserComponent } from '../../../modais/modal-disable-user/modal-disable-user.component';
import { ModalHistoricChangesComponent } from 'src/app/modules/shared/components/modais/modal-historic-changes/modal-historic-changes.component';

@Component({
  selector: 'app-users-permissions',
  templateUrl: './users-permissions.component.html',
  styleUrls: ['./users-permissions.component.scss']
})
export class UsersPermissionsComponent {

  search: string = '';
  loading: boolean = false;
  users: any [] = [];
  snackbar: Snackbar = new Snackbar();
  userSelected: any[] = [];
  columns: ColumnSlickGrid[] = [];
  customHeight: number = 285;
  columnsFilter: any[] = ['Teste 1', 'Teste 2', 'Teste 3'];
  configFilterColumnSelected: any[] = [];

  constructor(private router: Router, private modalService: NgbModal){
    this.getHeaderTable();
    this.getUsers();
  }

  //Faz a busca
  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.getUsers();
  }

  //Lista os usuários
  getUsers() {
    this.loading = true;
    this.users = [
      {
        id: 1,
        nome: 'Rodrigues ',
        sobrenome: 'Silveira',
        email: 'rodriguessilveira@email.com',
        departamento: 'Logística',
        status: 'Ativo',
        ultimoAcesso: '16/12/2023'
      },
      {
        id: 2,
        nome: 'Rodrigues ',
        sobrenome: 'Silveira',
        email: 'rodriguessilveira@email.com',
        departamento: 'Logística',
        status: 'Ativo',
        ultimoAcesso: '16/12/2023'
      },
      {
        id: 3,
        nome: 'Rodrigues ',
        sobrenome: 'Silveira',
        email: 'rodriguessilveira@email.com',
        departamento: 'Logística',
        status: 'Ativo',
        ultimoAcesso: '16/12/2023'
      },
      {
        id: 4,
        nome: 'Rodrigues ',
        sobrenome: 'Silveira',
        email: 'rodriguessilveira@email.com',
        departamento: 'Logística',
        status: 'Ativo',
        ultimoAcesso: '16/12/2023'
      },
      {
        id: 5,
        nome: 'Rodrigues ',
        sobrenome: 'Silveira',
        email: 'rodriguessilveira@email.com',
        departamento: 'Logística',
        status: 'Ativo',
        ultimoAcesso: '16/12/2023'
      }
    ];

  }

  //Cria um novo usuário
  createNewUser(){
    this.router.navigate(['settings/permissions/users-actions']);
  }

  //Abre o modal de confirmação para desativação do usuário
  confirmDeleteUser(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-delete-user',
    };

    const modalRef = this.modalService.open(ModalDeleteUserComponent, modalOptions);
  }

  //Seleção de usuário no grid
  rowsSelected(selected: any[]) {
    this.userSelected = [];
    this.userSelected = selected;
  }

  //Para edição de usuário TODO: mudar a rota para os usuários actions
  // goToEditUser(group: any) {
  //   this.router.navigate(['settings/permissions/actions'], {
  //     queryParams: { number: users.id }
  //   })
  // }

  goToEditUser(){}

  //Monta os headers das colunas
  getHeaderTable() {
    this.columns = [
      { name: 'Nome', id: 'nome', width: 100 },
      { name: 'Sobrenome', id: 'sobrenome', width: 100},
      { name: 'E-mail', id: 'email', width: 100},
      { name: 'Departamento', id: 'departamento', width: 100},
      { name: 'Status', id: 'status', width: 100},
      { name: 'Último acesso', id: 'ultimoAcesso', width: 100},
    ]
  }

  //Limpa os filtros feitos pelo usuário
  clearFilters(){}

  setFilterColumn(){}

  confirmActiveUser(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-active-user',
    };

    const modalRef = this.modalService.open(ModalActiveUserComponent, modalOptions);
  }

  confirmDisableUser(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-disable-user',
    };

    const modalRef = this.modalService.open(ModalDisableUserComponent, modalOptions);
  }

  openModalHistoricChanges(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-historic-changes',
    };
    const modalRef = this.modalService.open(ModalHistoricChangesComponent, modalOptions);
  }

}
