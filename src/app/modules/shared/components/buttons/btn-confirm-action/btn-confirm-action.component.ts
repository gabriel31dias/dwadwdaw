import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-confirm-action',
  templateUrl: './btn-confirm-action.component.html',
  styleUrls: ['./btn-confirm-action.component.scss']
})
export class BtnConfirmActionComponent {

  @Input() label: string = '';
  @Output() clicked = new EventEmitter<boolean>();
  @Input() height?: string = '2.5rem';
  @Input() fontSize?: string = '1rem';
  @Input() iconUrl?: string = '';
  @Input() classIcon: string = '';
  @Input() disabled: boolean = false;
  @Input() tooltip: string | null = null;

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  btnClicked(event: boolean) {
    this.clicked.emit(event);
  }
}
