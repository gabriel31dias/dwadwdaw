import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { implementZero } from '../../../utils/date-utils';

@Component({
  selector: 'app-custom-date-input',
  templateUrl: './custom-date-input.component.html',
  styleUrls: ['./custom-date-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomDateInputComponent implements OnChanges {

  @Input() label: string = '';
  @Input() entry: any;
  @Output() entryChanged = new EventEmitter<string>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entry']) {
      if (this.verifyAndFormatDate(this.entry) !== null) this.entry = this.verifyAndFormatDate(this.entry);
    }
  }

  // Função para formatar data do tipo DD/MM/AAAA para YYYY-MM-DD
  verifyAndFormatDate(date: string | null): string | null {
    if (date) {
      try {
        let day: string = date.split("/")[0];
        let month: string = date.split("/")[1];
        const year: string = date.split("/")[2];

        day = implementZero(day);
        month = implementZero(month);

        const newDate: string = `${year}-${month}-${day}`;

        return newDate;
      } catch (error) {
        return null;
      }
    } else {
      return '';
    }
  }
}
