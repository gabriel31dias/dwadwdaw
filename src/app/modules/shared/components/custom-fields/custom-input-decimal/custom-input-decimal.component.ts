import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-input-decimal',
  templateUrl: './custom-input-decimal.component.html',
  styleUrls: ['./custom-input-decimal.component.scss']
})
export class CustomInputDecimalComponent implements OnInit {

  @Input() label: string = '';
  @Input() placeholder: string = '0,00';
  @Input() required: boolean = false;
  @Input() entry: any;
  @Input() changed: boolean = false;
  @Output() entryChanged = new EventEmitter<any>();
  @Input() keydownEnter: boolean = false;
  @Output() keydownPress = new EventEmitter<any>();
  @Output() lostFocus = new EventEmitter<any>();
  @Input() maxLength: number = 15;




  constructor() { }

  ngOnInit(): void {


  }


  validator(): boolean {
    if (this.required == true && this.changed && !this.entry) {
      return true;
    } else {
      return false;
    }
  }

  keydown() {
    this.keydownPress.emit('');
  }


}
