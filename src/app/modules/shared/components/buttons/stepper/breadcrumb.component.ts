import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { StepperModel } from '../../../models/stepper.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnChanges {

  srcUrl: string = '../../../../../../assets/icons/stepper-icons/';
  @Input() steppers: StepperModel[] = [];
  @Input() stepperIndex: number = 0;
  @Output() stepperEmitter = new EventEmitter<number>();

  constructor(private translate: TranslateService) {
    translate.use('pt-br');

    setTimeout(() => {
      if (this.steppers.length >= 1) {
        this.changeStepper(this.stepperIndex)
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stepperIndex'] && !changes['stepperIndex'].firstChange) {
      const newStepperIndex = changes['stepperIndex'].currentValue;
      this.changeStepper(newStepperIndex);
    }

    if (changes['steppers']) {
      this.changeStepper(this.stepperIndex);
    }
  }

  changeStepper(level: number) {
    this.stepperEmitter.emit(level);
    this.steppers[level].class = 'selected';

    if (this.steppers[level].src.includes('-dark.svg')) {
      this.steppers[level].src = this.steppers[level].src.replace('-dark.svg', '-white.svg')
    }

    if (this.steppers[level].src.includes('-grey.svg')) {
      this.steppers[level].src = this.steppers[level].src.replace('-grey.svg', '-white.svg')
    }

    for (let count = 0; count < level; count++) {
      this.steppers[count].class = 'filled';

      if (this.steppers[count].src.includes('-white.svg')) {
        this.steppers[count].src = this.steppers[count].src.replace('-white.svg', '-dark.svg')
      }

      if (this.steppers[count].src.includes('-grey.svg')) {
        this.steppers[count].src = this.steppers[count].src.replace('-grey.svg', '-dark.svg')
      }
    }

    for (let count = level + 1; count < this.steppers.length; count++) {
      this.steppers[count].class = 'unselected';

      if (this.steppers[count].src.includes('-white.svg')) {
        this.steppers[count].src = this.steppers[count].src.replace('-white.svg', '-grey.svg')
      }

      if (this.steppers[count].src.includes('-dark.svg')) {
        this.steppers[count].src = this.steppers[count].src.replace('-dark.svg', '-grey.svg')
      }
    }
  }

}
