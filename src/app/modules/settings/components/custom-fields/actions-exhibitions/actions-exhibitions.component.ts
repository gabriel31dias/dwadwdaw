import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { CampoExibicao, DragDropExibicao, Exibicao } from '../../../models/exhibition.model';
import { CustomFieldService } from '../../../services/custom-field.service';
import { Modules, ListModules } from 'src/app/modules/shared/consts/list-modules.const';
import { ModalSetSizeComponent } from 'src/app/modules/shared/components/modais/modal-set-size/modal-set-size.component';
import { SizeCustomField } from '../../../models/size-custom-field';
import { ConfigExhibition, UpsertExhibition } from '../../../models/upsert-exhibition.model';
import { ModalPreviewNewDisplayComponent } from 'src/app/modules/shared/components/modais/modal-preview-new-display/modal-preview-new-display.component';
import { ExhibitionCustomField } from 'src/app/modules/shared/models/exhibition-custom-field.model';
import { TypeCustomField, typeWithItems } from '../../../models/type-custom-field';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';


@Component({
  selector: 'app-actions-exhibitions',
  templateUrl: './actions-exhibitions.component.html',
  styleUrls: ['./actions-exhibitions.component.scss']
})
export class ActionsExhibitionsComponent {

  companyId: string;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  targetElement?: any;
  indexSelected: number = -1;
  allFields: CampoExibicao[] = [];
  exhibition: Exibicao = <Exibicao>{}
  dragIndex: DragDropExibicao | null = null;
  dropIndex: DragDropExibicao | null = null;
  moduleSelected: string | null = null;
  Modules = Modules;
  ListModules = ListModules;
  alertRequired: boolean = false;
  allowDeletion: boolean = false;

  constructor(private router: Router,
    private modalService: NgbModal,
    private storage: StorageService,
    private route: ActivatedRoute,
    private customFieldService: CustomFieldService
  ) {
    this.companyId = storage.getCompanyId()!;

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.exhibition.codigo = Number(queryParams['number']);
        this.getDetailsExhibition();
      } else {
        this.exhibition.codigo = null;
        this.exhibition.habilitado = true;
        this.getAllFields();
      }
    })
    this.exhibition.campos = [];
  }

  verifyRequired(): boolean {
    if (this.exhibition.nome && this.exhibition.modulo) {
      return true;
    } else {
      this.alertRequired = true;
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      return false;
    }
  }

  setExhibition() {
    try {
      if (!this.verifyRequired()) return;

      this.loading = true;

      const configFields: ConfigExhibition[] = [];
      let order = 1
      for (const field of this.exhibition.campos) {
        const configField: ConfigExhibition = {
          idCampoPersonalizado: field.codigo,
          tamanhoExibicao: field.tamanho,
          ordemExibicao: order
        };
        configFields.push(configField)
        order++;
      }

      const req: UpsertExhibition =  {
        nome: this.exhibition.nome,
        modulo: this.exhibition.modulo,
        habilitado: this.exhibition.habilitado,
        configuracaoExibicao: configFields,
      }

      this.exhibition.codigo === null ? this.createExhibition(req) : this.updateExhibition(req);
    } catch (error) {
      this.snackbar.open = true;
      this.snackbar.message = this.exhibition.codigo === null ? 'erroAoCriarExibicao' : 'erroAoEditarExibicao';
    }
  }

  createExhibition(req: UpsertExhibition) {
    this.customFieldService.createExhibition(this.companyId, req).subscribe({
      next: (response) => {
        this.loading = false;
        this.exhibition.codigo = response.dados.id;

        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.router.navigate(['settings/exhibitions/actions'], {
          queryParams: { number: this.exhibition.codigo }
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

  updateExhibition(req: UpsertExhibition) {
    this.customFieldService.updateExhibition(this.companyId, this.exhibition.codigo!, req).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  getDetailsExhibition() {
    this.loading = true;
    this.customFieldService.getDetailsExhibition(this.companyId, this.exhibition.codigo!).subscribe({
      next: (response) => {
        const exhibitionBackend = response.dados;
        this.allowDeletion = response.dados.permiteExclusao;

        this.exhibition.codigo = exhibitionBackend.exibicao.id;
        this.exhibition.nome = exhibitionBackend.exibicao.nome;
        this.exhibition.modulo = exhibitionBackend.exibicao.modulo;
        this.exhibition.habilitado = exhibitionBackend.exibicao.habilitado;
        this.exhibition.campos = exhibitionBackend.configuracaoCampos;
        let count = 0;
        for (const field of exhibitionBackend.configuracaoCampos) {
          this.exhibition.campos[count].nome = field.label;
          count++;
        }

        this.getAllFields(true)
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  getAllFields(isUpdate?: boolean) {
    this.loading = true;
    this.customFieldService.getAllFieldsEnabled(this.companyId).subscribe({
      next: (response) => {
        this.allFields = response.dados;

        if (isUpdate) {
          for (const field of this.exhibition.campos) {
            const index = this.allFields.findIndex(
              fieldUnselected => fieldUnselected.codigo === field.codigo
            );
            if (index !== -1) this.allFields.splice(index, 1);
          }
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

  setSizeField(field?: CampoExibicao) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-set-size'
    };
    const modalRef = this.modalService.open(ModalSetSizeComponent, modalOptions);
    if (field) modalRef.componentInstance.selectedSize = field.tamanho;

    modalRef.result
      .then((response: SizeCustomField) => {
        if (response) {
          if (!field) {
            this.allFields[this.indexSelected].tamanho = response;
            this.exhibition.campos.push(this.allFields[this.indexSelected]);
            this.allFields.splice(this.indexSelected, 1);
            this.indexSelected = -1;
          } else {
            field.tamanho = response;
            const indexField: number = this.exhibition.campos.findIndex(
              oldField => oldField.codigo === field.codigo
            );
            this.exhibition.campos[indexField] = field;
          }
        }
      })
      .catch((res) => {

      })
  }

  removeField(field: CampoExibicao) {
    const indexField: number = this.exhibition.campos.findIndex(
      oldField => oldField.codigo === field.codigo
    );

    this.allFields.unshift(this.exhibition.campos[indexField]);
    this.exhibition.campos.splice(indexField, 1);
  }

  onExhibitionDragStart(event: any){
    this.targetElement = event.target;
  }

  onExhibitionDragOver(event: any){
    event.preventDefault();
  }

  onFieldDrop(event: any){
    event.preventDefault();
  }

  getPosition(field: CampoExibicao){
    this.indexSelected = this.allFields.indexOf(field);
  }

  onExhibitionDrop(event: any) {
    event.preventDefault();
    if (this.indexSelected !== -1) {
      this.setSizeField();
    }
  }

  onFieldDropRight(event: any, index: number, item: CampoExibicao) {
    event.preventDefault();
    if (this.dragIndex === null) {
      this.dragIndex = <DragDropExibicao>{};
      this.dragIndex.campo = item;
      this.dragIndex.indice = index;
    }

    this.dropIndex = <DragDropExibicao>{};
    this.dropIndex.campo = item;
    this.dropIndex.indice = index;
  }

  clearIndexes() {
    this.exhibition.campos[this.dragIndex!.indice] = this.dropIndex!.campo;
    this.exhibition.campos[this.dropIndex!.indice] = this.dragIndex!.campo;

    this.dragIndex = null;
    this.dropIndex = null;
  }

  transformString(value: Modules | null): string | null {
    if (value === null) return null;

    return String(value);
  }

  openModalPreView() {
    const fieldsPreview: ExhibitionCustomField[] = [];
    for (const field of this.exhibition.campos) {
      const newFieldPreview: ExhibitionCustomField = {
        idExibicao: 0,
        codigo: field.codigo,
        label: field.nome,
        tipo: field.tipo,
        itens: field.itens,
        tamanho: field.tamanho,
        valor: typeWithItems(field.tipo) ? [] : ''
      }
      fieldsPreview.push(newFieldPreview);
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-preview-display'
    };
    const modalRef = this.modalService.open(ModalPreviewNewDisplayComponent, modalOptions);
    modalRef.componentInstance.stepName = this.exhibition.nome;
    modalRef.componentInstance.displayFields = fieldsPreview;

    modalRef.result
      .then((response: any) => {

      })
      .catch((res) => {

      })
  }

  confirmDeleteExhibition() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = 'excluirExibicao';
    modalRef.componentInstance.text = 'textoExcluirExibicaoTelaVisualizacao';
    modalRef.componentInstance.style = 'red';
    modalRef.componentInstance.textBtnConfirm = 'excluir';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.deleteExhibition()
      }
    })
    .catch((res) => {

    })
  }

  deleteExhibition() {
    this.loading = true;
    this.customFieldService.deleteExhibition(this.companyId, this.exhibition.codigo!).subscribe({
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

  close() {
    this.router.navigate(['settings/exhibitions/list']);
  }
}
