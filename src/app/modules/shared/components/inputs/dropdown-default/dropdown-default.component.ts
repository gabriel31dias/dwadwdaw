import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown-default',
  templateUrl: './dropdown-default.component.html',
  styleUrls: ['./dropdown-default.component.scss']
})
export class DropdownDefaultComponent implements OnChanges {

  @Input() label: string = '';
  @Input() shortListed: string | null = null;
  @Input() optionSelected: string | null = this.shortListed;
  @Output() optionChanged = new EventEmitter<number | null>();
  @Input() placeholder: string = '';
  @Input() options: any[] = [];
  @Input() searchable: boolean = false;
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;
  @Input() advanced?: boolean = false;
  @Output() advancedOpen = new EventEmitter<boolean>();
  @Input() enableKeydown?: boolean = false;
  @Output() keydownPress = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Input() isCnpj?: boolean = false;
  @Output() editClient = new EventEmitter<boolean>();
  @Input() readonly?: boolean = false;
  @Output() btnSearchClicked = new EventEmitter<any>();
  @Input() alert: boolean = false;
  @Input() txtAlert: string = '';
  @Input() loading: boolean = false;
  @Input() loadingText: string = '';
  @ViewChild('dropdownDefault') dropdownDefault!: NgSelectComponent;

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
  ) {
    this.translate.use('pt-br');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.insertAdvancedSearch();
      if (this.options.length === 1 && !this.optionSelected && this.options[0] != "Busca avançada") {
       
        this.optionSelected = this.options[0];
        this.emitValue();
      }
    }
  
    if (changes['shortListed']) {
      this.optionSelected = changes['shortListed'].currentValue;
    }
  }

  insertAdvancedSearch() {
    if (this.advanced) {
      this.options.unshift('Busca avançada')
    }
  }

  emitSearch(search: any) {
    this.search.emit(search.term);
  }

  emitValue() {
    this.optionChanged.emit(
      this.options.indexOf(this.optionSelected) >= 0 ? this.options.indexOf(this.optionSelected) : null
    );

    setTimeout(() => {
      if (this.optionSelected === 'Busca avançada') {
        this.optionSelected = null;
      }
    }, 0);
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

  openEditClient() {
    this.editClient?.emit(true);
  }
  clear() {
    this.optionSelected = null;
  }

}
