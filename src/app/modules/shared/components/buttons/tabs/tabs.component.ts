import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  @Input() steppers: string[] = [];
  @Input() currentStepper: string = this.steppers[0];
  @Output() setCurrentStepper: EventEmitter<string> = new EventEmitter<string>();

  verifyCurrentStepper(stepper: string): boolean {
    return stepper === this.currentStepper ? true : false;
  }

  setStepper(stepperSelected: string) {
    this.currentStepper = stepperSelected;
    this.setCurrentStepper.emit(this.currentStepper)
  }

}
