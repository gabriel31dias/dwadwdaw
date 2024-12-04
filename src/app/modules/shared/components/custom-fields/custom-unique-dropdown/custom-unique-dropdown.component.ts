import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-unique-dropdown',
  templateUrl: './custom-unique-dropdown.component.html',
  styleUrls: ['./custom-unique-dropdown.component.scss'],
})
export class CustomUniqueDropdownComponent implements OnChanges {

  @Input() label: string = '';
  @Input() entry: any = '';
  @Input() placeholder: string = '';
  @Input() shortListed: any | null = null;
  @Input() optionSelected: string | null = this.shortListed;
  @Input() options: string[] = [];
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;
  @Input() readonly?: boolean = false;
  @Output() optionChanged = new EventEmitter<string | null>();

  constructor(private translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.translate.use('pt-br');
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['shortListed']) {
      this.optionSelected = changes['shortListed'].currentValue;
    }
  }


  selected(): boolean {
    return this.optionSelected ? true : false;
  }

  validator(): boolean {
    if (this.required == true && this.changed && !this.optionSelected) {
      return true;
    } else {
      return false;
    }
  }


  clear() {
    this.optionSelected = null;
  }

}
