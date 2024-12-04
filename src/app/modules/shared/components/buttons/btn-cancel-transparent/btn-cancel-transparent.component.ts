import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-cancel-transparent',
  templateUrl: './btn-cancel-transparent.component.html',
  styleUrls: ['./btn-cancel-transparent.component.scss']
})
export class BtnCancelTransparentComponent {

  @Input() label: string = '';
  @Output() clicked= new EventEmitter<boolean>();

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  btnClicked(event: boolean) {
    this.clicked.emit(event);
  }

}
