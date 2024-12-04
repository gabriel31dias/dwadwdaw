import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input() label: string = '';
  @Input() shortListed: string | null = null;
  @Input() optionSelected: string | null = this.shortListed;
  @Output() optionChanged = new EventEmitter<number | null>();
  @Input() placeholder: string = '';
  @Input() options: any[] = [];
  @Input() enableTooltip: boolean = false;
  @Input() searchable: boolean = false;
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;
  @Input() enableKeydown?: boolean = false;
  @Output() keydownPress = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Input() readonly?: boolean = false;
  @Output() btnSearchClicked = new EventEmitter<any>();
  @Input() alert: boolean = false;
  @Input() txtAlert: string = '';
  @Input() loading: boolean = false;
  @Input() loadingText: string = '' ;

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
  ) {
    this.translate.use('pt-br');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shortListed']) {
      this.optionSelected = changes['shortListed'].currentValue;
    }
  }

  emitSearch(search: any) {
    this.search.emit(search.term);
  }


  emitValue() {
    if (!this.enableTooltip) {
      if (this.optionSelected === null) {
        this.optionChanged.emit(this.optionSelected);
      } else {
        this.optionChanged.emit(
          this.options.indexOf(this.optionSelected) >= 0 ? this.options.indexOf(this.optionSelected) : null
        );
      }
    } else {
      this.optionChanged.emit(
        this.options.findIndex(option => option.name === this.optionSelected) >= 0
          ? this.options.findIndex(option => option.name === this.optionSelected)
          : null
      );
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

  keydown() {
    if (this.optionSelected) {
      this.keydownPress.emit(true);
    }
  }

  clear() {
    this.optionSelected = null;
  }

}
