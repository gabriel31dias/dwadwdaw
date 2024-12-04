import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';

import { formatDateBrToUtc, formatDateToStringBR, formatDateToStringUTC, formatDateUtcToBr, formatStringUTCToDate, isValidDate } from '../../../utils/date-utils';
import { Snackbar } from '../../../models/snackbar.model';
import { PeriodsFilter } from '../../../consts/periods-filter.const';
import { PeriodDateFilter } from '../../../models/period-date.model';
import { convertDateFormat, isYearBefore1900, setPeriod } from '../../../utils/period.utils';
import { CustomDateAdapter } from '../../../services/datepicker.service';
import { DateValidationsCollection } from 'src/app/modules/collection/models/date-validations-collection.model';
import { SnackbarType } from '../../../consts/snackbar-type.const';

@Component({
  selector: 'app-input-period',
  templateUrl: './input-period.component.html',
  styleUrls: ['./input-period.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})

export class InputPeriodComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  @Output() periodEmitter = new EventEmitter<PeriodDateFilter>();
  periodsFilter = PeriodsFilter;
  initialDateFormatted: Date | null = null;
  finalDateFormatted: Date | null = null;
  initialDate: string = '';
  finalDate: string = '';
  snackbar: Snackbar = new Snackbar();
  @ViewChild('rangeInput') rangeInput!: MatDateRangeInput<Date>;
  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  focusInputPeriod: boolean = false;
  minDate: string = '1900-01-02';
  minDateFormatted: Date | null = null;
  @Input() dateTimeValidations: DateValidationsCollection = <DateValidationsCollection>{};
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;


  constructor(private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.use('pt-br');
    this.minDateFormatted = formatStringUTCToDate(this.minDate);
  }

  ngAfterViewInit() {
    this.rangeInput.separator = 'Até';
  }

  ngOnInit(): void {
    this.updateDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['periodFilter']) this.updateDates();
  }

  private updateDates(): void {
    this.initialDateFormatted = this.periodFilter.initDate ? formatStringUTCToDate(this.periodFilter.initDate) : null;
    this.finalDateFormatted = this.periodFilter.finalDate ? formatStringUTCToDate(this.periodFilter.finalDate) : null;
    this.initialDate = this.periodFilter.initDate ? formatDateUtcToBr(this.periodFilter.initDate) : '';
    this.finalDate = this.periodFilter.finalDate ? formatDateUtcToBr(this.periodFilter.finalDate) : '';
  }

  changePeriod(periodSelected: PeriodsFilter) {
    this.periodFilter.period = periodSelected;
    this.periodFilter = setPeriod(this.periodFilter.period!);
    this.initialDateFormatted = formatStringUTCToDate(this.periodFilter.initDate!);
    this.finalDateFormatted = formatStringUTCToDate(this.periodFilter.finalDate!);
    this.initialDate = formatDateUtcToBr(this.periodFilter.initDate);
    this.finalDate = formatDateUtcToBr(this.periodFilter.finalDate);
    this.periodEmitter.emit(this.periodFilter);
  }

  applyFilter() {
    if (this.initialDateFormatted && this.finalDateFormatted) {
      this.initialDate = formatDateToStringBR(this.initialDateFormatted);
      this.finalDate = formatDateToStringBR(this.finalDateFormatted);
      this.periodFilter.initDate = formatDateToStringUTC(this.initialDateFormatted);
      this.periodFilter.finalDate = formatDateToStringUTC(this.finalDateFormatted);
      this.periodFilter.period = null;

      this.periodEmitter.emit(this.periodFilter);
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'escolhaUmPeriodo';
    }
  }


  /** Valida se a data inicial ou final é anterior ao ano de 1900,retorna true se o campo for obrigátorio e pelo menos uma das datas for anterior a 1900,caso contrário retorna false.
   * @returns Retorna `true` se uma das datas for anterior a 1900 e o campo for obrigatório; caso contrário, retorna `false`.
  */
  validator(): boolean {
    if (this.required) {
      if (isYearBefore1900(convertDateFormat(this.initialDate)) || isYearBefore1900(convertDateFormat(this.finalDate))){
        return true;
      }
    }
    return false;
  }

  /** Verifica a validade das datas inicial e final.
   * @returns Retorna `true` se qualquer uma das datas for inválida ou se ambas forem válidas conforme a condição específica; caso contrário, retorna `false`.
   */
  verifyDate(): boolean {
    if (isYearBefore1900(convertDateFormat(this.initialDate)) || isYearBefore1900(convertDateFormat(this.finalDate))) { 
      this.dateTimeValidations.alertDate = true;
      return true;
    }
    else if (isValidDate(this.initialDate) && isValidDate(this.finalDate)) {
      this.dateTimeValidations.alertDate = true;
      return true;
    } else {
      this.dateTimeValidations.alertDate = false;
      this.dateTimeValidations.alertDateMessage = '';
      return false;
    }
  }
  /** Emite os valores formatados das datas inicial e final e aplica filtros, com base na data válida.
   *  @param inputChanged: 'start' | 'end' 'start' para data inicial, 'end' para data final.
   */
  emitValue(inputChanged: 'start' | 'end') {
    if (isValidDate(this.initialDate) && isValidDate(this.finalDate)) {
      this.validationPeriod(inputChanged);
      if(isYearBefore1900(convertDateFormat(this.initialDate)) || isYearBefore1900(convertDateFormat(this.finalDate))){
        this.snackbar.open = true;
        this.snackbar.message = 'anoMenorQue1900';
        this.snackbar.type = SnackbarType.Default;
        return;
      }
      
      this.initialDateFormatted = formatStringUTCToDate(formatDateBrToUtc(this.initialDate));
      this.finalDateFormatted = formatStringUTCToDate(formatDateBrToUtc(this.finalDate));
      this.applyFilter()
    } else {
      this.initialDateFormatted = null;
      this.finalDateFormatted = null;
      this.snackbar.open = true;
      this.snackbar.message = 'infoDataInvalidaPeriodo';
    }
  }
  
  validationPeriod(inputChanged: 'start' | 'end') {
    const date1: Date = formatStringUTCToDate(formatDateBrToUtc(this.initialDate))!;
    const date2: Date = formatStringUTCToDate(formatDateBrToUtc(this.finalDate))!;
    if (date1 > date2) {
      if (inputChanged === 'start') this.finalDate = this.initialDate;
      if (inputChanged === 'end') this.initialDate = this.finalDate;
    }
  }

  clearDates() {
    this.initialDateFormatted = null;
    this.finalDateFormatted = null;
    this.initialDate = '';
    this.finalDate = '';
    this.periodFilter.initDate = '';
    this.periodFilter.finalDate = '';
    this.periodFilter.period = null;

    this.periodEmitter.emit(this.periodFilter);
  }

  setFocusEnd() {
    this.rangeInput.focused = true;
  }

  /** Manipula a mudança de data no campo de entrada. */
  onDateChanged (event: Event) {
    const newDate = (event.target as HTMLInputElement).value;
    this.initialDate = newDate;
    this.finalDate = newDate;
    this.verifyDate();
  }

}
