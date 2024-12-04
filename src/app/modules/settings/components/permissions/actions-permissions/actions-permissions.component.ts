import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { ModalViewPermissionsGroupComponent } from '../../../modais/modal-view-permissions-group/modal-view-permissions-group.component';
import { ModalSearchUserPermissionComponent } from '../../../modais/modal-search-user-permission/modal-search-user-permission.component';
import { Permission } from '../../../models/permissions-module.model';
import { STEPPER_PERMISSIONS } from '../../../models/steppers-permition';
import { PermissionService } from '../../../services/permission.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { filterNoRepeatArray } from 'src/app/modules/shared/utils/array-utils';
import { GrupoPermissao } from '../../../models/group-permission.model';
import { TableSimpleGridComponent } from 'src/app/modules/shared/components/tables/table-simple-grid/table-simple-grid.component';
import { DropdownDefaultComponent } from 'src/app/modules/shared/components/inputs/dropdown-default/dropdown-default.component';
import { ModalRemoveUserGroupPermissionComponent } from '../../../modais/modal-remove-user-group-permission/modal-remove-user-group-permission.component';
import { ModalConfirmationChangeUserGroupComponent } from '../../../modais/modal-confirmation-change-user-group/modal-confirmation-change-user-group.component';
import { ModuloPermission, PermissionGroup } from '../../../models/view-permission-group.model';

@Component({
  selector: 'app-actions-permissions',
  templateUrl: './actions-permissions.component.html',
  styleUrls: ['./actions-permissions.component.scss']
})
export class ActionsPermissionsComponent {

  companyId: string;
  groupId: number | null = null;
  group: GrupoPermissao = <GrupoPermissao>{};
  search: string = '';
  columns: ColumnSlickGrid[] = [];
  usersGroup: any[] = [];
  usersListObj: any[] = [];
  usersListSearch: string[] = [];
  usersSelected: any[] = [];
  userSelected: string | null = null;
  usersRemoved: any[] = [];
  steppers: string[] = STEPPER_PERMISSIONS;
  currentStepper: string = this.steppers[0];
  customHeight: number = 285;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  settingsPermissions: Permission[] = [];
  collectionPermissions: Permission[] = [];
  conferencePermissions: Permission[] = [];
  accountReceivablePermissions: Permission[] = [];
  accountsPayPermissions: Permission[] = [];
  @ViewChild(TableSimpleGridComponent) tableComponent!: TableSimpleGridComponent;
  @ViewChild(DropdownDefaultComponent) dropdown!: DropdownDefaultComponent;
  timeout: any;
  updateTable: boolean = false;
  alertRequired: boolean = false;

  constructor(private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private storage: StorageService,
    private permissionService: PermissionService
  ) {
    this.companyId = storage.getCompanyId()!;
    this.getHeaderTable();
    this.setHeightTable();

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.groupId = Number(queryParams['number']);
        this.getDetailsGroup();
      } else {
        this.getPermissions();
      }
    })

  }

  // Monta o header do GRID de listagem de usuários.
  getHeaderTable() {
    this.columns = [
      { name: 'Usuários', id: 'nome', width: 100 },
      { name: 'E-mail', id: 'email', width: 100 },
      { name: 'Departamento', id: 'departamento', width: 100 },
    ]
  }

  // Define o tamanho do GRID de acordo com a quantidade de usuários listados.
  setHeightTable() {
    const increment = 40;
    const maxHeight = 285;

    this.customHeight = 85;
    for (const userGroup of this.usersGroup) {
      if (this.customHeight < maxHeight) {
        this.customHeight += increment;
      }
    }
  }

  // Retorna os detalhes do Grupo de permissão.
  getDetailsGroup() {
    this.loading = true;
    this.permissionService.getDetailsGroup(this.groupId!, this.companyId).subscribe({
      next: (response) => {
        this.group.nome = response.dados.nome;
        this.getPermissionsByGroup();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Retorna as permissões de acorod com o id do grupo.
  getPermissionsByGroup() {
    this.permissionService.getPermissionsByGroup(this.companyId, this.groupId!).subscribe({
      next: (response) => {
        const allPermissions: Permission[] = response.dados;
        this.settingsPermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Configurações');
        this.collectionPermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Coleta');
        this.conferencePermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Conferência');
        this.accountReceivablePermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Contas a receber');
        this.accountsPayPermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Contas a pagar');
        this.getUsersByGroup();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Retorna os usuários de acordo com o id do grupo.
  getUsersByGroup() {
    this.permissionService.getUsersByGroup(this.companyId, this.groupId!).subscribe({
      next: (response) => {
        if (response.dados.length >= 1) {
          this.updateTable = true;
          this.usersGroup = response.dados
          let count = 0;
          for (const user of this.usersGroup) {
            user.id = count;
            count++;
          }
          this.updateComponentsUsers();
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

  // Busca as permissões registradas no banco de dados.
  getPermissions() {
    this.loading = true;
    this.permissionService.getPermissions(this.companyId).subscribe({
      next: (response) => {
        const allPermissions: Permission[] = response.dados;
        this.loading = false;
        this.settingsPermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Configurações');
        this.collectionPermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Coleta');
        this.conferencePermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Conferência');
        this.accountReceivablePermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Contas a receber');
        this.accountsPayPermissions = allPermissions.filter((permission) => permission.nomeModulo === 'Contas a pagar');
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Muda de módulo.
  changeStepper(stepper: string) {
    this.currentStepper = stepper;
  }

  // Realiza a busca dos usuários.
  searchUser(search: string) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loading = true;
    this.timeout = setTimeout(() => {
      this.permissionService.getUsers(this.companyId, search).subscribe({
        next: (response) => {
          this.usersListObj = response.dados;
          const usersIdSelecteds = this.usersGroup.map(user => user.email);
          this.usersListObj = this.usersListObj.filter(userObj => !usersIdSelecteds.includes(userObj.email));

          this.usersListSearch = [];
          for (const user of this.usersListObj) {
            this.usersListSearch.push(user.nome)
          }

          this.loading = false;
        },
        error: (response) => {
          this.loading = false;
        }
      })
    }, 1000);
  }

  // Seleciona o usuário do qual foi escolhido no dropdown.
  setUserSelected(selected: number | null) {
    if (selected !== null) {
      const user: any = this.usersListObj.at(selected);
      user.id = this.usersGroup.length;
      if (user.grupo) {
        this.openModalConfirmChangeGroupUser([user]);
      } else {
        this.updateTable = true;
        if (this.groupId !== null) this.usersSelected.push(user);
        this.usersGroup.push(user)
        this.updateComponentsUsers();
      }
    } else {
      this.userSelected = null;
    }
  }

  // Atualiza todos os componentes relacionados aos usuários do grupo de permissões.
  updateComponentsUsers() {
    this.tableComponent.updateDataset(this.usersGroup)
    this.usersListSearch = [];
    this.usersListObj = [];
    setTimeout(() => {
      this.setHeightTable();
      this.updateTable = false;
      this.userSelected = null;
      this.dropdown.clear();
    }, 0);
  }


  // Abre o modal para criação de um novo usuário.
  createNewUser() {

  }

  // Remove o usuário do GRID.
  removeUser(userToRemove: any) {
    this.usersRemoved.push(userToRemove);
    if (this.usersGroup.length >= 1) this.usersGroup = this.usersGroup.filter(user => user.email !== userToRemove.email);
    if (this.usersSelected.length >= 1) this.usersSelected = this.usersSelected.filter(user => user.email !== userToRemove.email);

    this.updateTable = true;
    this.updateComponentsUsers();
  }

  // Monta as informações para serem enviadas ao backend.
  setGroup() {
    this.group.permissoes = [];
    this.group.permissoes = this.group.permissoes.concat(
      this.settingsPermissions,
      this.collectionPermissions,
      this.conferencePermissions,
      this.accountReceivablePermissions,
      this.accountsPayPermissions
    );
    this.group.permissoes = this.group.permissoes.map(permission => ({
      idPermissoesModulo: permission.idPermissoesModulo,
      habilitado: permission.habilitado
    }))

    if (this.groupId === null) {
      this.group.usuarios = this.usersGroup.length >= 1 ? this.usersGroup.map(user => user.email) : [];
    } else {
      this.group.usuarios = this.usersSelected.length >= 1 ? this.usersSelected.map(user => user.email) : [];
    }

    if (this.group.nome) {
      if (this.groupId === null) {
        this.createGroup();
      } else {
        this.editGroup();
      }
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'informeNomeGrupo';
      this.alertRequired = true;
    }
  }

  // Realiza a criação de um novo grupo de permissão.
  createGroup() {
    this.loading = true;
    this.permissionService.createGroup(this.companyId, this.group.nome).subscribe({
      next: (response) => {
        const groupId = response.dados.id;
        this.setPermissionsGroup(groupId);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a edição do grupo de permissão.
  editGroup() {
    this.loading = true;
    this.permissionService.editGroup(this.companyId, this.groupId!, this.group.nome).subscribe({
      next: (response) => {
        this.setPermissionsGroup(this.groupId!);
        if (this.usersRemoved.length >= 1) this.backendRemoveUsers();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Atualiza as permissões do grupo.
  setPermissionsGroup(groupId: number) {
    const body = {
      idGrupoPermissoes: groupId,
      permissoes: this.group.permissoes
    }

    this.permissionService.setPermissionsGroup(this.companyId, body).subscribe({
      next: (response) => {
        this.setUsersGroup(groupId);
        this.permissionsUser();
      },
      error: (response) => {
        this.router.navigate(['settings/permissions/actions'], {
          queryParams: { number: this.groupId }
        })
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Adiciona usuario(s) no grupo.
  setUsersGroup(groupId: number) {
    const body = {
      idGrupoPermissoes: groupId,
      logins: this.group.usuarios
    }

    this.permissionService.setUsersGroup(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        if (this.groupId === null) {
          this.snackbar.open = true;
          this.snackbar.message = 'grupoPermissaoCadastradoSucesso';
          this.router.navigate(['settings/permissions/actions'], {
            queryParams: { number: groupId }
          })
        } else {
          this.snackbar.open = true;
          this.snackbar.message = 'grupoPermissaoEditadoSucesso';
        }
      },
      error: (response) => {
        this.router.navigate(['settings/permissions/actions'], {
          queryParams: { number: this.groupId }
        })
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  backendRemoveUsers() {
    const body = {
      idGrupoPermissoes: this.groupId!,
      logins: this.usersRemoved.map(user => user.email)
    }

    this.permissionService.removeUsersGroup(this.companyId, body).subscribe({
      next: (response) => {
        this.usersRemoved = [];
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Retorna para a tela de listagem de grupos.
  close() {
    this.router.navigate(['settings/permissions/groups']);
  }

  // Abre o modal de pré-visualizar dados do grupo.
  openModalViewGroupPermissions() {
    let permissions: Permission[] = [];
    permissions = permissions.concat(
      this.settingsPermissions,
      this.collectionPermissions,
      this.conferencePermissions,
      this.accountReceivablePermissions,
      this.accountsPayPermissions
    );

    const listPermissions: ModuloPermission[] = permissions.reduce((acc: ModuloPermission[], item: Permission) => {
      if (item.habilitado) {
        const foundIndex = acc.findIndex(element => element.modulo === item.nomeModulo);
        if (foundIndex !== -1) {
          acc[foundIndex].permissoes.push(item.nomePermissao);
        } else {
          acc.push({
            modulo: item.nomeModulo,
            permissoes: [item.nomePermissao]
          });
        }
      }
      return acc;
    }, []);

    let groupview: PermissionGroup[] = []
    let groupViewObj: PermissionGroup = {
      grupo: this.group.nome,
      moduloPermissao: listPermissions,
      usuariosGrupo: this.usersGroup.map(user => user.nome)
    }

    groupview.push(groupViewObj)

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-view-permission-group',
    };
    const modalRef = this.modalService.open(ModalViewPermissionsGroupComponent, modalOptions);
    modalRef.componentInstance.permissionGroups = groupview;


    modalRef.result
      .then((result) => {

      })
      .catch((res) => {

      })
  }

  // Abre o modal para seleção avançada de usuários.
  openModalSearchUserPermissions(searchText: string) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-user-permission',
    };
    const modalRef = this.modalService.open(ModalSearchUserPermissionComponent, modalOptions);
    modalRef.componentInstance.searchText = searchText;
    modalRef.componentInstance.usersSelecteds = this.usersGroup;

    modalRef.result.then((result) => {
      if (result.length >= 1) {
        let userHaveGroup: boolean = false;
        for (const user of result) {
          if (user.grupo) userHaveGroup = true;
        }

        if (userHaveGroup) {
          this.openModalConfirmChangeGroupUser(result);
        } else {
          this.updateTable = true;
          this.usersGroup = this.usersGroup.concat(result)
          this.usersGroup = filterNoRepeatArray(this.usersGroup, 'email');
          if (this.groupId !== null) {
            this.usersSelected = this.usersSelected.concat(result);
            this.usersSelected = filterNoRepeatArray(this.usersSelected, 'email');
          }
          let count = 0;
          for (const user of this.usersGroup) {
            user.id = count;
            count++;
          }
          this.updateComponentsUsers()
        }
      }
    }).catch((res) => {

    });
  }

  // Remove o usuário do grupo.
  openModalRemoveUserGroupPermissionConfirmation(user: any) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-remove-user-group-permission',
    };

    const modalRef = this.modalService.open(ModalRemoveUserGroupPermissionComponent, modalOptions);
    modalRef.componentInstance.group = this.group.nome;

    modalRef.result.then((result) => {
      if (result) {
        this.removeUser(user)
      }
    }).catch((res) => {

    });
  }

  // Abre o modal para confirmação da mudança de grupo do usuário.
  openModalConfirmChangeGroupUser(user: any[]) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirmation-chance-user-group',
    };

    const modalRef = this.modalService.open(ModalConfirmationChangeUserGroupComponent, modalOptions);
    modalRef.componentInstance.newGroup = this.group.nome;
    if (user.length === 1) modalRef.componentInstance.group = user[0].grupo;

    modalRef.result.then((result) => {
      if (result) {
        this.updateTable = true;
        if (this.groupId !== null) this.usersSelected = this.usersSelected.concat(user);
        this.usersGroup = this.usersGroup.concat(user);

        let count = 0
        for (const user of this.usersGroup) {
          user.id = count;
          count++;
        }

        this.updateComponentsUsers();
      } else {
        this.dropdown.clear();
      }
    }).catch((res) => {

    });
  }

  // Obtém as permissões do usuário logado e salva elas no local storage.
  permissionsUser() {
    this.permissionService.getPermissionsUser(this.companyId).subscribe({
      next: (response) => {
        this.loading = false;
        const permissions: string[] = response.dados;
        this.storage.setPermissionsUser(permissions);
      },
      error: (response) => {
        this.loading = false;
        const permissions: string[] = [];
        this.storage.setPermissionsUser(permissions);
      }
    })
  }

}
