import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-time-input',
  templateUrl: './custom-time-input.component.html',
  styleUrls: ['./custom-time-input.component.scss']
})
export class CustomTimeInputComponent implements OnInit {

  @Input() label: string = '';
  @Input() placeholder: string = '00:00:00';
  @Input() required: boolean = false;
  @Input() entry: any;
  @Input() changed: boolean = false;
  @Output() entryChanged = new EventEmitter<string>();
  @Output() keydownPress = new EventEmitter<any>();
  @Output() lostFocus = new EventEmitter<void>();
  @Input() keydownEnter: boolean = false;
  dropSpecialCharacters: boolean = true;
  @Input() mask: string = '';

  constructor() { }

  ngOnInit(): void {
    this.setMask();
  }

  setMask() {
    this.dropSpecialCharacters = false;
    this.mask = 'Hh:m0:s0';
  }

  validator(): boolean {
    return this.required && this.changed && !this.entry;
  }

  keydown() {
    this.entryChanged.emit(this.entry);
  }
}

