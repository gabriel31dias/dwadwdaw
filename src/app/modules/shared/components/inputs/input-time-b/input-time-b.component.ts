import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrWhitespace } from '../../../utils/string-utils';

@Component({
  selector: 'app-input-time-b',
  templateUrl: './input-time-b.component.html',
  styleUrls: ['./input-time-b.component.scss']
})
export class InputTimeBComponent {
  @ViewChild('dropdownDefault') dropdownDefault!: NgSelectComponent;
  @Input() optionSelected: string | null = null;
  @Output() optionChanged = new EventEmitter<string | null>();
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() searchable: boolean = false;
  @Input() required?: boolean = false;

  @Input() changed?: boolean = false;
  @Input() enableKeydown?: boolean = false;
  @Input() readonly: boolean = false;
  @Input() alert: boolean = false;
  @Input() txtAlert: string = '';

  @Output() keydownPress = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() btnSearchClicked = new EventEmitter<any>();

  public hours: string[] = [
    "00:00", "00:30",
    "01:00", "01:30",
    "02:00", "02:30",
    "03:00", "03:30",
    "04:00", "04:30",
    "05:00", "05:30",
    "06:00", "06:30",
    "07:00", "07:30",
    "08:00", "08:30",
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00", "18:30",
    "19:00", "19:30",
    "20:00", "20:30",
    "21:00", "21:30",
    "22:00", "22:30",
    "23:00", "23:30"
  ];

  constructor(private translate: TranslateService,
  ) {
    this.translate.use('pt-br');

    setTimeout(() => {
      if(this.optionSelected === '') {
        this.dropdownDefault.clearModel();
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shortListed']) {
      this.optionSelected = changes['shortListed'].currentValue;
    }
  }

  emitSearch(search: any) {
    this.search.emit(search.term);
  }

  emitValue() {
    this.optionChanged.emit(this.optionSelected);
    setTimeout(() => { if(isNullOrWhitespace(this.optionSelected)) this.optionSelected = null; }, 0);
  }

  selected(): boolean {
    return !isNullOrWhitespace(this.optionSelected) ? true : false;
  }

  validator(): boolean {
    if (
      (this.required == true && this.changed && !this.optionSelected)
      || !isNullOrWhitespace(this.txtAlert)
    ) {
      return true;
    } else {
      return false;
    }
  }

  keydown() {
    if (!isNullOrWhitespace(this.optionSelected)) {
      this.keydownPress.emit(true);
    }
  }

  clear() {
    this.optionSelected = null;
  }
}
