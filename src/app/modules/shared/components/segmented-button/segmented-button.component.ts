import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrls: ['./segmented-button.component.scss']
})
export class SegmentedButtonComponent {

  @Input() text: string = '';
  @Input() num: number | null = null;
  @Input() clicked: boolean = false;
  @Output() selected = new EventEmitter<boolean>();
  @Input() value?: string | null = null;
  // Funcionalidade para mostrar primeiro o total e depois o valor caso for true.
  @Input() firstTotalAfterValue?: boolean = false;
  @Input() disableDeselect: boolean = false;
  @Input() toolTip: string = "";
  @Input() tooltipClass: string = "tooltip-default";

  constructor(private translate: TranslateService) {
    translate.use('pt-br')
  }

}
