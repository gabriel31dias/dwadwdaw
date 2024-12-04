import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-one-line-text-input',
  templateUrl: './custom-one-line-text-input.component.html',
  styleUrls: ['./custom-one-line-text-input.component.scss']
})
export class CustomOneLineTextInputComponent implements OnInit {

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() entry: any = '';
  @Input() changed: boolean = false;
  @Input() maxLength: number = 500;
  @Output() entryChanged = new EventEmitter<string>();
  @Input() keydownEnter: boolean = false;
  @Output() keydownPress = new EventEmitter<any>();
  @Output() lostFocus = new EventEmitter<any>();
  @Input() required: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  validator(): boolean {
    if (this.required && this.changed && !this.entry) {
      return true;
    } else {
      return false;
    }
  }

  keydown() {
    this.keydownPress.emit('');
  }

}

