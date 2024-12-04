import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcessoPermissaoConferenciaModel } from '../../models/check-acesss.model';
import { ConferenceService } from '../../services/conference.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';



@Component({
  selector: 'app-modal-permission',
  templateUrl: './modal-permission.component.html',
  styleUrls: ['./modal-permission.component.scss']
})

export class ModalPermissionComponent {

    reason: string = '';
    nConference: number | null = null;
    accessPermission: AcessoPermissaoConferenciaModel = <AcessoPermissaoConferenciaModel>{};
    snackbar: Snackbar = new Snackbar();
    loading: boolean = false;
    dataEmpty: boolean = false;
    companyId: string;
    title: string = '';
    text: string = '';
    style!: 'red' | 'green';
    textBtnConfirm: string = 'Permitir';
    textBtnCancel: string = 'Cancelar'
    cdCollectionsSelected: any[] = [];


    constructor(private translate: TranslateService,
      private modal: NgbActiveModal,
      private conferenceService: ConferenceService,
      private storage: StorageService
    ) {
      translate.use('pt-br')
      this.companyId = storage.getCompanyId()!
    }


  validationData(): boolean {
    if (!this.accessPermission.emailUsuarioComPermissao || !this.accessPermission.senhaUsuarioComPermissao) {
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      return false;
    } else {
      return true;
    }
  }

    close() {
      this.modal.close(false);
    }

    checkAccess() {
      if (this.validationData()) {
      this.accessPermission.idConferencia = Number(this.nConference!)
      this.loading = true;
      this.conferenceService.checkAccess(this.companyId , this.accessPermission).subscribe({
        next: (response) => {
          this.loading = false;
          const authorized = response.dados.autorizado;
          this.modal.close(authorized)
        },
        error: (response) => {
          this.loading = false;
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro
          this.loading = false;

        },
      })
    }else  {
      this.dataEmpty = true;
  }
  }
}
