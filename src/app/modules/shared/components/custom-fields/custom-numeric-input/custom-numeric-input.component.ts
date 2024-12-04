import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-numeric-input',
  templateUrl: './custom-numeric-input.component.html',
  styleUrls: ['./custom-numeric-input.component.scss']
})
export class CustomNumericInputComponent implements OnInit {

  @Input() label: string = '';
  @Input() placeholder: string = '0';
  @Input() required: boolean = false;
  @Input() entry!: any;
  @Input() changed: boolean = false;
  @Output() entryChanged = new EventEmitter<any>();
  @Input() keydownEnter: boolean = false;
  @Input() maxLength: number = 12;
  @Output() keydownPress = new EventEmitter<any>();
  @Output() lostFocus = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {}

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

