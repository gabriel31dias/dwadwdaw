import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrls: ['./input-text-area.component.scss']
})
export class InputTextAreaComponent {

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() entry: string = '';
  @Input() maxLength: number | 'no-limit' = 500;
  @Output() entryChanged = new EventEmitter<string>();
  @Input() readonly: boolean = false;
  @Input() height: string = '4.6875rem';
  @Input() desativeInformationMaxLenght: boolean = false;
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;
  @Input() txtAlert: string = '';

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  validator(): boolean {
    if (this.required == true && this.changed && (this.entry === null || this.entry === '' || this.entry === undefined)) {
      return true;
    } else {
      if (this.txtAlert && this.changed) {
        return true;
      }
      return false;
    }
  }

}
