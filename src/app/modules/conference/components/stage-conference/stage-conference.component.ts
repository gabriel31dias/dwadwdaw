import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Volume } from '../../models/volum.model';
import { Etiqueta } from '../../models/tag.model';
import { ConferenceService } from '../../services/conference.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { b64toBlob } from 'src/app/modules/shared/utils/b64-to-blob';
import { WebsocketPrinterService } from 'src/app/modules/shared/services/websocket-printer.service';
import { v4 as uuidv4 } from 'uuid';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalObservationVolumeComponent } from '../../modais/modal-observation-volume/modal-observation-volume.component';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';

@Component({
  selector: 'app-stage-conference',
  templateUrl: './stage-conference.component.html',
  styleUrls: ['./stage-conference.component.scss']
})
export class StageConferenceComponent implements OnChanges {

  companyId: string;
  permissions: string [] = [];
  authConference = ConferenciaPermissoes;
  headers: string[] = [ 'notaFiscalTratado', 'volumeTratado', 'chave', 'conferenciaTratado' ];
  @Input() nConference: number | null = null;
  @Input() volumes: Volume[] = [];
  @Output() volumesEmitter = new EventEmitter<Volume[]>();
  @Input() tags: Etiqueta[] = [];
  @Input() tagsName: string[] = [];
  @Input() tagSelected: Etiqueta = <Etiqueta>{};
  @Output() tagEmitter = new EventEmitter<Etiqueta>();
  @Input() barCode: string = '';
  @Output() barCodeEmitter = new EventEmitter<string>();
  @Input() allVolumes: number = 0;
  @Input() volumesChecked: number = 0;
  @Input() allVolumesRead: number = 0;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  @Output() updateVolums = new EventEmitter<any>();
  @Output() updateDetails = new EventEmitter<any>();
  @Input() currentStatus: number = 0;
  heightScreen: number = 0;
  maxHeightTable: string = '';
  @Input() printTag: boolean = false;
  @Output() printTagEmitter = new EventEmitter<boolean>();
  @Input() blindConference: boolean = false;

  constructor(private translate: TranslateService,
    private storage: StorageService,
    private conferenceService: ConferenceService,
    private websocketPrinter: WebsocketPrinterService,
    private modalService: NgbModal,
  ) {
    translate.use('pt-br');
    this.companyId = storage.getCompanyId()!;
    this.permissions = storage.getPermissionsUser();
  }

  // Função para tornar a tabela de listagem de volumes responsiva à altura da tela do usuário.
  updateHeightTable() {
    this.heightScreen = window.innerHeight;

    let decrement: number = 0;
    if (this.currentStatus >= 2) {
      decrement = 11.75;
    } else {
      decrement = 12.75;
    }

    const count = Math.floor((this.heightScreen/40) -  decrement);
    this.maxHeightTable = (40 * count) + 'px';

    if (40 * count < 120) {
      this.maxHeightTable = '120px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Atualiza a altura da tabela quando a janela é redimensionada.
    this.updateHeightTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.volumesEmitter.emit(this.volumes);

    if (changes['currentStatus']) {
      this.updateHeightTable();
    }
  }

  // Função que atribui qual tipo de etiqueta o usuário selecionou.
  selectTag(index: number | null) {
    if (index !== null) {
      this.tagSelected = this.tags[index];
      this.tagEmitter.emit(this.tagSelected)
    } else {
      this.tagSelected = <Etiqueta>{};
      this.tagEmitter.emit(this.tagSelected)
    }
  }

  // Função que realiza a conferência de um volume.
  checkVolume() {
    if (this.barCode && this.tagSelected.cdConfigEtiqueta) {
      this.loading = true;

      const bodyReq = {
        idConferencia: Number(this.nConference),
        tipoCodigoBarras: this.tagSelected.cdConfigEtiqueta,
        codigoBarras: this.barCode,
        usuario: null
      }

      this.conferenceService.checkVolum(this.companyId, bodyReq).subscribe({
        next: (response) => {
          if (response.dados === null) {
            this.barCodeEmitter.emit('');
            this.snackbar.open = true;
            this.snackbar.message = 'volumeNaoEncontrado';
            this.loading = false;
          } else {
            if (this.printTag && response.dados.tipoBaixaVolume.toLowerCase() === 'conferido') {
              this.printTagVolume(this.barCode);
            }

            setTimeout(() => {
              this.barCodeEmitter.emit('');
              this.updateVolums.emit();
              this.loading = false;
            }, 0);

            this.updateDetails.emit();
          }
        },
        error: (response) => {
          this.barCodeEmitter.emit('');
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
          this.loading = false;
        }
      })

    } else {
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
  }

  // Função para impressão automática que é chamada após a conferência de um volume, caso o checkbox (this.printTag) estiver selecionado.
  printTagVolume(barCode: string) {
    this.loading = true;
    this.conferenceService.printTagVolume(this.companyId, Number(this.nConference), this.tagSelected.cdConfigEtiqueta, barCode).subscribe({
      next: (response) => {
        this.loading = false;

        const tag = response.dados

        this.doPrintTag(tag)
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.loading = false;
      }
    })
  }

  // Função para impressão através do botão de impressão de etiqueta única com referência ao volume clicado do componente "table-sort".
  printTagSingle(volume: any) {
    this.loading = true;
    this.conferenceService.printTagSingleVolume(this.companyId, Number(this.nConference), volume.idHistorico, volume.volume).subscribe({
      next: (response) => {
        this.loading = false;

        const tag = response.dados

        this.doPrintTag(tag)
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.loading = false;
      }
    })
  }

  // Função que envia o base64 para impressão no programa WebApp Hardware Bridge ou para o navegador (caso não estiver com o programa rodando na máquina).
  doPrintTag(base64: string) {
    if (this.websocketPrinter.isConnected()) {
      const uuid = uuidv4()

      this.websocketPrinter.submit({
        'type': 'ETIQUETA',
        'url': `${uuid}.pdf`,
        'file_content': `${base64}`
      })
    } else {
      const blob: Blob = b64toBlob(base64, 'application/pdf');
      const fileUrl: string = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');

      document.body.appendChild(iframe);

      iframe.style.display = 'none';

      iframe.onload = () => {
        setTimeout(() => {
          if (iframe) {
            iframe.focus();
            iframe.contentWindow?.print();
          }
        }, 0);
      };

      if (iframe) {
        iframe.src = fileUrl;
      }
    }
  }

  // Deleta o volume não encontrado.
  deleteVolumNofFound(volume: any) {
    this.loading = true;
    const volumeId: number = volume.idHistorico;
    this.conferenceService.deleteVolumeNotFound(this.companyId, volumeId).subscribe({
      next: (response) => {
        this.updateVolums.emit();
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

  openModalObservation() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-observation-volume',
    };

    this.modalService.open(ModalObservationVolumeComponent, modalOptions);
  }

  triggerModalIfRequired(volume: any) {
    const volumeConferenciaTratado = volume.conferenciaTratado;
    if (volumeConferenciaTratado === 'Não encontrado') {
      this.openModalObservation();
    }
  }

}
