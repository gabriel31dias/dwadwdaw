import { Component } from '@angular/core';
import { yearsPerPage } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';

import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { getDateNow, isFutureDate, isYearBefore1900 } from 'src/app/modules/shared/utils/period.utils';

@Component({
  selector: 'app-modal-download-collection',
  templateUrl: './modal-download-collection.component.html',
  styleUrls: ['./modal-download-collection.component.scss']
})
export class ModalDownloadCollectionComponent {

  dateDownload: string = '';
  time: string = '';
  collectionsSelected: number | null = null;
  snackbar: Snackbar = new Snackbar();
  alertRequired: boolean = false;
  dateNow: string = '';
  dateValidation: boolean = false;
  dateValidationMessage: string = '';
  timeValidation: boolean = false;
  timeValidationMessage: string = '';

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br')

    this.dateNow = getDateNow();
  }

  close() {
    this.modal.close(false);
  }

  /** Confirma e valida a data e hora fornecidas, e realiza as ações com base na validade dessas informações. */
  confirm() {
    if (this.dateDownload && this.time) {
      if (isYearBefore1900(this.dateDownload)) {
        this.snackbar.open = true;
        this.snackbar.message = 'erroDataPassada1900';
        this.snackbar.type = SnackbarType.Default;
        return; 
      }
      if (isFutureDate(this.dateDownload, this.time)) {
        this.snackbar.open = true;
        this.snackbar.message = 'erroDataHoraFutura';
        this.snackbar.type = SnackbarType.Default;
        return;
      } 
        this.modal.close({
          date: this.dateDownload,
          time: this.time
        });
      
    } else {
      this.alertRequired = true;
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      this.snackbar.type = SnackbarType.Default;
    }
  }

  /** Verifica se a data é válida,não podendo ser o ano menor que 1900 e não podendo conter data no futuro
   *  @returns Retorna `true` se a data for inválida (ano menor que 1900 ou data passada) ou `false` se a data for válida.
  */
  verifyDate() {
    if (this.dateDownload && isYearBefore1900(this.dateDownload)) {
      this.dateValidation = true;
      this.dateValidationMessage = 'anoMenorQue1900';
      return true;
    }else  if (this.dateDownload && isFutureDate(this.dateDownload)) {
      this.dateValidation = true;
      this.dateValidationMessage = 'dataFuturoNaoPermitida';
      return true;
    } else {
      this.dateValidation = false;
      this.dateValidationMessage = '';
      return false;
    }
  }

  verifyTimeInit() {
    if (this.dateDownload && this.time && isFutureDate(this.dateDownload, this.time)) {
      this.timeValidation = true;
      this.timeValidationMessage = 'horaFuturoNaoPermitida';
      return true;
    } else {
      this.timeValidation = false;
      this.timeValidationMessage = '';
      return false;
    }
  }

  /** Verifica se tanto a data quanto o horário inicial estejam corretos e atendam aos critérios definidos. */
  verifyDateTime() {
    this.verifyDate();
    this.verifyTimeInit();
  }
}
