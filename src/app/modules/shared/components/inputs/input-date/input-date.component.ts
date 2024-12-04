import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';

import { CustomDateAdapter } from '../../../services/datepicker.service';
import { formatDateBrToUtc, formatDateToStringBR, formatDateUtcToBr, formatStringUTCToDate, isValidDate } from '../../../utils/date-utils';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ]
})
export class InputDateComponent implements OnChanges {

  @Input() label: string = '';
  @Input() required?: boolean = false;
  @Input() date: any = '';
  dateFormatted: Date | null = null;
  @Input() changed?: boolean = false;
  @Output() dateChanged = new EventEmitter<string>();
  @Input() readonly: boolean = false;
  @Input() ignoreTranslate: boolean = false;
  @Input() minDate: string = '1900-01-01';
  @Input() maxDate: string = '9999-12-31';
  @Input() alertMessage: string = '';
  minDateFormatted: Date | null = null;
  maxDateFormatted: Date | null = null;

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');

    this.minDateFormatted = formatStringUTCToDate(this.minDate);
    this.maxDateFormatted = formatStringUTCToDate(this.maxDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minDate']) {
      if (changes['minDate'].currentValue) this.minDateFormatted = formatStringUTCToDate(changes['minDate'].currentValue);
    }

    if (changes['maxDate']) {
      if (changes['maxDate'].currentValue) this.maxDateFormatted = formatStringUTCToDate(changes['maxDate'].currentValue);
    }

    if (changes['date']) {
      let newDate: string = changes['date'].currentValue;
      if (newDate && newDate.includes('-')) newDate = formatDateUtcToBr(newDate);

      if (isValidDate(newDate)) {
        this.dateFormatted = formatStringUTCToDate(changes['date'].currentValue);
        this.date = formatDateUtcToBr(changes['date'].currentValue);
      }
    }
  }

  validator(): boolean {
    if (this.required == true && this.changed && !this.date) {
      return true;
    } else {
      if (this.alertMessage && this.changed) {
        return true;
      }
      return false;
    }
  }

  dateSelected(event: any) {
    this.date = formatDateToStringBR(event.value);
    this.emitValue();
  }

  emitValue() {
    if (isValidDate(this.date)) {
      this.dateFormatted = formatStringUTCToDate(formatDateBrToUtc(this.date));
      this.dateChanged.emit(formatDateBrToUtc(this.date));
    }

    if (this.date === '' || this.date === null) this.dateChanged.emit('');
  }

  /** Limpa os filtros de data */
  clearDate(): void {
    this.date = null;
    this.dateFormatted = null;
    this.emitValue();  
  }

}
