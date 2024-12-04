import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-time',
  templateUrl: './input-time.component.html',
  styleUrls: ['./input-time.component.scss']
})
export class InputTimeComponent {

  @Input() label: string = '';
  @Input() required?: boolean = false;
  @Input() time: string = '';
  @Input() changed?: boolean = false;
  @Output() timeChanged = new EventEmitter<string>();
  @Input() readonly: boolean = false;
  @Input() alertMessage: string = '';

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  validator(): boolean {
    if (this.required == true && this.changed && !this.time) {
      return true;
    } else {
      if (this.alertMessage && this.changed) {
        return true;
      }
      return false;
    }
  }
  clearTime(): void {
    this.time = ''; 
    this.timeChanged.emit(this.time); 
  }
}
