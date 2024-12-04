import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {

  @Input() value: boolean = false;
  @Output() setValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  // @Input() labelBiling: string = '';
  randomNumber = Math.random();

}
