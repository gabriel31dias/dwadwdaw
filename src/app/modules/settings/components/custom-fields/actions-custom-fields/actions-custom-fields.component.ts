import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { TypeCustomField } from '../../../models/type-custom-field';
import { CustomField } from '../../../models/custom-field.model';
import { CustomFieldService } from '../../../services/custom-field.service';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-actions-custom-fields',
  templateUrl: './actions-custom-fields.component.html',
  styleUrls: ['./actions-custom-fields.component.scss']
})
export class ActionsCustomFieldsComponent {

  companyId: string;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  customField: CustomField = <CustomField>{};
  items: string[] = [ '' ];
  TypeCustomField = TypeCustomField;

  constructor(private router: Router,
    private modalService: NgbModal,
    private storage: StorageService,
    private route: ActivatedRoute,
    private customFieldService: CustomFieldService
  ) {
    this.companyId = storage.getCompanyId()!;
    this.customField.itens = [];
    this.customField.habilitado = true;

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.customField.codigo = Number(queryParams['number']);
        this.getDetailsCustomField();
      }
    })
  }

  // Verifica se os campos para cadastro/edição estão preenchidos corretamente, e verifica se é um cadastro ou edição.
  setField() {
    if (this.verifyRequired() === true) {
      if (!this.customField.codigo) {
        this.createNewField();
      } else {
        this.editField();
      }
    }
  }

  // Realiza o cadastro do campo personalizado com os dados preenchidos.
  createNewField() {
    this.loading = true;
    if (this.typeWithItemsSelected() === false) this.customField.itens = [];
    this.customFieldService.createCustomField(this.companyId, this.customField).subscribe({
      next: (response) => {
        this.loading = false;
        this.customField.codigo = response.dados.id;
        const idField: number = response.dados.id;

        this.snackbar.open = true;
        this.snackbar.message = 'campoPersonalizadoCadastradoSucesso';
        this.router.navigate(['settings/custom-fields/actions'], {
          queryParams: { number: idField }
        })
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca dos dados do campo personalizado.
  getDetailsCustomField() {
    this.loading = true;
    this.customFieldService.getDetailsCustomField(this.companyId, this.customField.codigo!).subscribe({
      next: (response) => {
        this.loading = false;
        this.customField = response.dados;

        if (this.customField.itens.length !== this.items.length) {
          const rest: number = this.customField.itens.length - this.items.length;
          for (let count = 0; count < rest; count++) this.items.push('')
        }
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a edição do campo personalizado.
  editField() {
    this.loading = true;
    if (this.typeWithItemsSelected() === false) this.customField.itens = [];
    this.customFieldService.editCustomField(this.companyId, this.customField).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = 'campoPersonalizadoEditadoSucesso';
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Verifica se os dados para cadastro/edição estão preenchidos.
  verifyRequired(): boolean {
    if (this.customField.nome && this.customField.tipo) {
      if (this.typeWithItemsSelected()) {
        if (this.customField.itens.length < 1) {
          this.snackbar.open = true;
          this.snackbar.message = 'erroInsiraItemParaCadastroCampoPersonalizado';
          return false;
        } else {
          return true;
        }
      }

      return true;
    } else {
      if (!this.customField.nome && !this.customField.tipo) {
        this.snackbar.open = true;
        this.snackbar.message = 'preenchaCamposObrigatorios';
      }

      if (!this.customField.nome && this.customField.tipo) {
        this.snackbar.open = true;
        this.snackbar.message = 'informeNomeCampoPersonalizado';
      }

      if (this.customField.nome && !this.customField.tipo) {
        this.snackbar.open = true;
        this.snackbar.message = 'selecioneTipoCampoPersonalizado';
      }

      return false
    }
  }

  // Retorna para a tela de listagem de campos personalizados.
  close() {
    this.router.navigate(['settings/custom-fields/list']);
  }

  // Grava a seleção do tipo de campo personalizado.
  setTypeField(type: TypeCustomField) {
    this.customField.tipo = type;
  }

  // Abre um novo item para cadastro.
  addNewItem() {
    this.items.push('');
    this.customField.itens.push('');
  }

  // Remove o item selecionado.
  removeItem(index: number) {
    this.items.splice(index, 1);
    this.customField.itens.splice(index, 1);
  }

  // Grava o item informado pelo usuário.
  setValueItem(value: string, index: number) {
    this.customField.itens[index] = value;
  }

  // Verifica se o tipo de campo personalizado é do tipo pode cadastrar itens.
  typeWithItemsSelected(): boolean {
    if (this.customField.tipo === TypeCustomField.CaixaSelecaoUnica
      || this.customField.tipo === TypeCustomField.CaixaSelecaoMultipla
      || this.customField.tipo === TypeCustomField.ListaSuspensa
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Abre o modal de confirmação de deleção de campo personalizado.
  confirmDeleteField() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = 'excluirCampoPersonalizado';
    modalRef.componentInstance.text = 'textoExcluirCampoPersonalizadoTelaVisualizacao';
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

  // Realiza a exclusão do campo personalizado.
  deleteField() {
    this.loading = true;
    this.customFieldService.deleteField(this.companyId, this.customField.codigo!).subscribe({
      next: (response) => {
        this.loading = false;
        this.close();
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
