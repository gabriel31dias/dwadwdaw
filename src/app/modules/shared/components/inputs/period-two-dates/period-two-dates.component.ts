import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { formatDateUtcToBr } from '../../../utils/date-utils';
import { Snackbar } from '../../../models/snackbar.model';
import { PeriodsFilter } from '../../../consts/periods-filter.const';
import { PeriodDateFilter } from '../../../models/period-date.model';
import { setPeriod } from '../../../utils/period.utils';

@Component({
  selector: 'app-period-two-dates',
  templateUrl: './period-two-dates.component.html',
  styleUrls: ['./period-two-dates.component.scss']
})
export class PeriodTwoDatesComponent implements OnInit, OnChanges {

  @Input() periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  @Output() periodEmitter = new EventEmitter<PeriodDateFilter>();
  periodsFilter = PeriodsFilter;
  initialDate: string = '';
  finalDate: string = '';
  openChangePeriod: boolean = false;
  snackbar: Snackbar = new Snackbar();

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  ngOnInit(): void {
    this.updateDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['periodFilter']) this.updateDates();
  }

  private updateDates(): void {
    this.initialDate = this.periodFilter.initDate ? formatDateUtcToBr(this.periodFilter.initDate) : '';
    this.finalDate = this.periodFilter.finalDate ? formatDateUtcToBr(this.periodFilter.finalDate) : '';
  }

  openModal() {
    if (!this.openChangePeriod) {
      setTimeout(() => {
        this.openChangePeriod = true;
      }, 0);
    }
  }

  closeModal() {
    setTimeout(() => {
      this.openChangePeriod = false;
    }, 1)
  }

  radioClicked() {
    setTimeout(() => {
      this.periodFilter = setPeriod(this.periodFilter.period!);
    }, 0);
  }

  applyFilter() {
    if (this.periodFilter.initDate && this.periodFilter.finalDate) {
      this.initialDate = formatDateUtcToBr(this.periodFilter.initDate);
      this.finalDate = formatDateUtcToBr(this.periodFilter.finalDate);

      this.periodEmitter.emit(this.periodFilter);
      this.closeModal();
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'escolhaUmPeriodo';
    }
  }

  clearDates() {
    this.initialDate = '';
    this.finalDate = '';
    this.periodFilter.initDate = '';
    this.periodFilter.finalDate = '';
    this.periodFilter.period = null;

    this.periodEmitter.emit(this.periodFilter);
    this.closeModal();
  }

}
