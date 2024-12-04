import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { Etiqueta } from '../../models/tag.model';
import { ConferenceService } from '../../services/conference.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';

@Component({
  selector: 'app-modal-search-volumes',
  templateUrl: './modal-search-volumes.component.html',
  styleUrls: ['./modal-search-volumes.component.scss']
})
export class ModalSearchVolumesComponent {

  snackbar: Snackbar = new Snackbar();

  companyId: string;
  @Input() tags: Etiqueta[] = [];
  @Input() tagsName: string[] = [];
  @Input() tagSelected: Etiqueta = <Etiqueta>{};
  @Input() barCode: string = '';

  headers: any[] = [];
  volumes: any[] = [];

  loading: boolean = false;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private conferenceService: ConferenceService,
    private storage: StorageService,
    private cd: ChangeDetectorRef
  ) {
    translate.use('pt-br');
    this.companyId = storage.getCompanyId()!;

    // Atribuição das colunas para envio do slickgrid
    this.headers = [
      { name: 'Código do volume', id: 'codigoVolume', width: 150 },
      { name: 'Número do volume', id: 'numeroVolume', width: 150 },
      { name: 'Número da nota fiscal', id: 'notaFiscalNf', width: 150 },
      { name: 'Número da conferência', id: 'conferenciaId', width: 150 },
      { name: 'Tipo de conferência', id: 'tipoConferencia', width: 150 },
      { name: 'Ação', id: 'acaoRealizada', width: 150 },
      { name: 'Data e hora', id: 'dataHoraTratado', width: 150 },
      { name: 'Filial', id: 'filial', width: 150 },
      { name: 'Usuário', id: 'usuario', width: 150 }
    ];

    this.getTagsTypes();
  }

  close() {
    this.modal.close();
  }

  // Função que busca os tipos de etiquetas para alimentar o dropdown.
  getTagsTypes() {
    this.conferenceService.getTags(this.companyId).subscribe({
      next: (response) => {
        this.tags = response.dados;

        this.tagsName = [];
        this.tags.forEach(tag => {
          this.tagsName.push(tag.dcConfigEtiqueta);
        });
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Função que atribui qual tipo de etiqueta o usuário selecionou.
  selectTag(index: number | null) {
    if (index !== null) {
      this.tagSelected = this.tags[index];
    } else {
      this.tagSelected = <Etiqueta>{};
    }
  }

  // Função que realiza a busca do volume que o usuário informou.
  searchVolume() {
    if (this.barCode && this.tagSelected.cdConfigEtiqueta) {
      this.volumes = [];
      this.loading = true;

      this.conferenceService.getHistoricVolum(this.companyId, this.tagSelected.cdConfigEtiqueta, this.barCode).subscribe({
        next: (response) => {
          if (response.dados === null || response.dados.length === 0) {
            this.snackbar.open = true;
            this.snackbar.message = 'volumeNaoEncontrado';
          } else {
            this.volumes = response.dados;
          }

          this.loading = false;
        },
        error: (response) => {
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
          this.loading = false;
        }
      })

    } else {
      // Validações para caso o usuário não inserir o tipo de etiqueta e/ou código de barras.
      if (this.barCode && !this.tagSelected.cdConfigEtiqueta) {
        this.snackbar.open = true;
        this.snackbar.message = 'insiraUmaEtiqueta';
      }

      if (!this.barCode && this.tagSelected.cdConfigEtiqueta) {
        this.snackbar.open = true;
        this.snackbar.message = 'insiraUmCodigo';
      }

      if (!this.barCode && !this.tagSelected.dcConfigEtiqueta) {
        this.snackbar.open = true;
        this.snackbar.message = 'insiraUmaEtiquetaECodigo';
      }
    }

    this.barCode = '';
    this.cd.detectChanges();
  }

}
