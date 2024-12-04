import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { SharedService } from '../../../services/shared.service';
import { Filial } from '../../../models/subsidiaries.model';
import { EmpresaUsuario } from '../../../models/companies-user.model';
import { Snackbar } from '../../../models/snackbar.model';

@Component({
  selector: 'app-modal-change-subsidiary',
  templateUrl: './modal-change-subsidiary.component.html',
  styleUrls: ['./modal-change-subsidiary.component.scss']
})
export class ModalChangeSubsidiaryComponent {

  companyId: string;
  subsidiaries: Filial[] = [];
  subsidiariesName: string[] = [];
  subsidiarySelected: number | null = null;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();

  constructor(private modal: NgbActiveModal,
    private storage: StorageService,
    private sharedService: SharedService
  ) {
    this.companyId = storage.getCompanyId()!;
    this.getSubsidiaries();
  }

  close() {
    this.modal.close();
  }

  // Busca as filiais da empresa matriz.
  getSubsidiaries() {
    this.loading = true;
    this.sharedService.getSubsidiaries(this.companyId).subscribe({
      next: (response) => {
        this.loading = false;
        this.subsidiaries = response.dados;
        this.subsidiariesName = this.subsidiaries.map(sub => {
          return sub.nome;
        })
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mmensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Modifica a filial em que o usuário está logado.
  setCompany() {
    if (this.subsidiarySelected !== null) {
      const company: EmpresaUsuario = {
        empresaId: this.companyId,
        nomeFantasia: this.subsidiaries[this.subsidiarySelected].nome,
        cdFilial: this.subsidiaries[this.subsidiarySelected].cdFilial
      }

      this.loading = true;
      this.sharedService.changeSubsidiary(this.companyId, company.cdFilial!).subscribe({
        next: (response) => {
          this.loading = false;
          this.storage.setCompany(company);
          this.modal.close(true);
        },
        error: (response) => {
          this.loading = false;
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
        }
      })
    }
  }

}
