import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PermissionGroup } from '../../models/view-permission-group.model';

@Component({
  selector: 'app-modal-view-permissions-group',
  templateUrl: './modal-view-permissions-group.component.html',
  styleUrls: ['./modal-view-permissions-group.component.scss']
})
export class ModalViewPermissionsGroupComponent implements OnInit {
  @ViewChild('modal') modalRef!: TemplateRef<any>;
  permissionGroups: PermissionGroup[] = [];

  constructor(private modal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  formatarUsuarios(usuariosGrupo: string[]): string {
    if (!usuariosGrupo || usuariosGrupo.length === 0) return '';
    if (usuariosGrupo.length === 1) return usuariosGrupo[0] + '.';
    const copiaUsuarios = [...usuariosGrupo];
    const ultimoUsuario = copiaUsuarios.pop();
    return `${copiaUsuarios.join(', ') + ' e ' + ultimoUsuario}.`;
  }

  close() {
    this.modal.close();
  }
}
