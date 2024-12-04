import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Snackbar } from '../../../models/snackbar.model';
import { RelatorioLista } from '../../../models/relatorio-lista';
import { SnackbarType } from '../../../consts/snackbar-type.const';

@Component({
  selector: 'app-modal-select-layout-report',
  templateUrl: './modal-select-layout-report.component.html',
  styleUrls: ['./modal-select-layout-report.component.scss']
})
export class ModalSelectLayoutReportComponent implements OnInit {

  snackbar: Snackbar = new Snackbar();
  action: 'send-whatsapp' | 'print' | 'download-pdf' | null = null;
  text: string = '';
  textBtnConfirm: string = '';
  reports: RelatorioLista[] = [];
  reportsName: string[] = [];
  reportSelected: RelatorioLista = <RelatorioLista>{};
  alertRequired: boolean = false;

  /** Construtor da classe `ModalActionsDriverComponent`.
   * @param translateService Service responsável pela tradução do sistema.
   * @param modal Referência ao modal ativo.
  */
  constructor(private translateService: TranslateService,
    private modal: NgbActiveModal
  ) {
    translateService.use('pt-br');
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    this.setTextModal();

    for (const report of this.reports) {
      this.reportsName.push(report.descricao);
    }
  }

  /** Método responsável por atribuir os textos no modal e no botão de confirmação. */
  setTextModal() {
    switch (this.action) {
      case 'download-pdf':
        this.text = 'textoSelecioneLayoutPDF';
        this.textBtnConfirm = 'gerarPDF';
        break;
      case 'print':
        this.text = 'textoSelecioneLayoutImpressao';
        this.textBtnConfirm = 'imprimir';
        break;
      case 'send-whatsapp':
        this.text = 'textoSelecioneLayoutWhatsapp';
        this.textBtnConfirm = 'compartilhar';
        break;
      case null:
        this.text = '';
        this.textBtnConfirm = '';
        break
    }
  }

  /** Fecha o modal sem enviar a escolha de relatório. */
  close() {
    const result = {
      status: false,
      report: null
    }

    this.modal.close(result);
  }

  /** Confirma a escolha de relatório e envia a escolha ao componente onde foi chamado o modal. */
  confirm() {
    if (this.reportSelected.codigo) {
      const result = {
        status: true,
        report: this.reportSelected
      }

      this.modal.close(result)
    } else {
      this.alertRequired = true;
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      this.snackbar.type = SnackbarType.Default
    }
  }

  /** Atribui o valor selecionado no `app-select`. */
  setLayout(index: number | null) {
    if (index !== null) {
      this.reportSelected = this.reports[index];
    } else {
      this.reportSelected = <RelatorioLista>{};
    }
  }

}

