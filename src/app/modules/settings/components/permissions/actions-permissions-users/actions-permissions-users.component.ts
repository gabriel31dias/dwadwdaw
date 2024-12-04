import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalRequestNewPasswordComponent } from '../../../modais/modal-request-new-password/modal-request-new-password.component';

@Component({
  selector: 'app-actions-permissions-users',
  templateUrl: './actions-permissions-users.component.html',
  styleUrls: ['./actions-permissions-users.component.scss']
})
export class ActionsPermissionsUsersComponent {

  alertRequired: boolean = false;
  users: any = <any>{};
  gruposDeAcesso: string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  grupoSelected: string | null = null;
  usuarioValidacao: boolean = true;

  constructor(private modalService: NgbModal,
    private router: Router
  ){}

  usuarioPadrao(valor: boolean) {
    this.usuarioValidacao = valor;
  }

  back(){
    this.router.navigate(['settings/permissions/users']);
  }

  openModalRequestNewPassword() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-request-new-password',
    };
    const modalRef = this.modalService.open(ModalRequestNewPasswordComponent, modalOptions);

  }

}
