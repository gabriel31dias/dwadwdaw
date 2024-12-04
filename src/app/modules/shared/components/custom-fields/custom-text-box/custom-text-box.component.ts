import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-text-box',
  templateUrl: './custom-text-box.component.html',
  styleUrls: ['./custom-text-box.component.scss']
})
export class CustomTextBoxComponent {
  @Input() label: string = '';
  @Input() entry: any = '';
  @Input() maxLength: number | 'no-limit' = 500;
  @Output() entryChanged = new EventEmitter<string>();
  @Input() readonly: boolean = false;
  @Input() height: string = '4.6875rem';
  @Input() required?: boolean = false;

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }
}
