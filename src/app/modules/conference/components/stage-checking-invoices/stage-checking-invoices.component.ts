import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConferenceService } from '../../services/conference.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';

@Component({
  selector: 'app-stage-checking-invoices',
  templateUrl: './stage-checking-invoices.component.html',
  styleUrls: ['./stage-checking-invoices.component.scss']
})
export class StageCheckingInvoicesComponent implements OnChanges {

  companyId: string;
  permissions: string [] = [];
  authConference = ConferenciaPermissoes;
  nConference: number | null = null;
  keyAccess: string = '';
  headers: string[] = [ 'notaFiscalTratado', 'status' ];
  @Input() invoices: any[] = [];
  @Output() updateInvoices = new EventEmitter<any>();
  @Input() allInvoices: number = 100;
  @Input() invoicesChecked: number = 0;
  @Input() currentStatus: number = 0;
  heightScreen: number = 0;
  maxHeightTable: string = '';
  flConferenciaNf: boolean = true;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();

  constructor(private translate: TranslateService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private storage: StorageService,
    private conferenceService: ConferenceService
  ) {
    translate.use('pt-br');
    this.companyId = storage.getCompanyId()!;
    this.permissions = storage.getPermissionsUser();

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.nConference = queryParams['number'];
      }
    });

    this.updateHeightTable();
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
    this.updateHeightTable();
  }

  // Função que realiza a conferência de um volume.
  checkVolume() {
    if (this.keyAccess && this.keyAccess.length === 44) {
      const conferenceId: number = Number(this.nConference);
      const key: string = this.keyAccess;
      this.loading = true;
      this.conferenceService.checkInvoice(this.companyId, conferenceId, key).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.keyAccess = '';
            this.updateInvoices.emit();
            this.loading = false;
          }, 0);
        },
        error: (response) => {
          this.keyAccess = '';
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
          this.loading = false;
        }
      })

    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'insiraUmaChaveDeAcesso';
    }
  }

  // Realiza a exclusão do registro selecionado.
  deleteNFNotFound(record: any) {
    this.loading = true;
    const idConferenceNF: number = record.idConferenciaNf;
    this.conferenceService.deleteNFNotFound(this.companyId, idConferenceNF).subscribe({
      next: (response) => {
        this.loading = false;
        this.updateInvoices.emit();
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
