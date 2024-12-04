import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss']
})
export class InputSearchComponent {

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() tooltip: string = '';
  @Input() entry: string = '';
  @Output() entryChanged = new EventEmitter<string>();
  @Input() mask: string = '';
  @Input() maxLength: number = 500;
  @Input() openModal: boolean = false;
  @Output() lostFocus = new EventEmitter<string>();
  @Output() clicked = new EventEmitter<string>();

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  clear() {
    this.entry = '';
  }

  emitValue() {
    this.entryChanged.emit(this.entry)
  }

}
