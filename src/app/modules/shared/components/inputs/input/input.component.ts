import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required?: boolean = false;
  @Input() entry: any;
  @Input() changed?: boolean = false;
  @Output() entryChanged = new EventEmitter<any>();
  @Input() mask: string = '';
  @Input() readonly: boolean = false;
  @Input() currency: boolean = false;
  @Input() noPrefix: boolean = false;
  @Input() optionsCurrency: { prefix: string } = { prefix: 'R$ ' };
  @Input() keydownEnter: boolean = false;
  @Output() keydownPress = new EventEmitter<any>();
  @Input() minLength: number = 0;
  @Input() maxLength: number = 200;
  @Input() iconBarCode: boolean = false;
  @Input() copy: boolean = false;
  @Output() lostFocus = new EventEmitter<any>();
  showPassword: boolean = false;
  dropSpecialCharacters: boolean = true;
  @Input() txtAlert: string = '';
  @Input() icon: string = '';
  @Input() uppercase: boolean = false;

  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  ngOnInit(): void {
    if (this.noPrefix) {
      this.optionsCurrency = { prefix: '' }
    }

    this.setMask();
  }

  hasValueEntry(): boolean {
    if (this.entry === null || this.entry === '' || this.entry === undefined) return false;

    return true;
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

  verifyTypePassword(): boolean {
    if (this.type == 'password' && this.showPassword) {
      return true;
    } else {
      return false;
    }
  }

  keydown() {
    this.keydownPress.emit('');
  }

  copyText() {
    const inputElement = document.createElement('input');
    inputElement.value = this.entry;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
  }

  setMask() {
    if (this.mask) {
      switch (this.mask.toLowerCase()) {
        case 'date':
          this.dropSpecialCharacters = false;
          this.mask = 'd0/M0/0000'
          break;

        case 'time':
          this.dropSpecialCharacters = false;
          this.mask = 'Hh:m0:s0'
          break;

        case 'date-time':
          this.dropSpecialCharacters = false;
          this.mask = 'd0/M0/0000 - Hh:m0:s0'
          break;

        case 'rg':
          this.mask = 'A{2}.A{3}.A{3}-A{1}'
          break;

        case 'cpf':
          this.mask = '000.000.000-00'
          break;

        case 'cnpj':
          this.mask = '00.000.000/0000-00'
          break;

        case 'cellphone':
          this.mask = '(00) 00000-0000'
          break;

        case 'cep':
          this.mask = '00000-000'
          break;

        default:
          break;
      }
    }
  }
}
