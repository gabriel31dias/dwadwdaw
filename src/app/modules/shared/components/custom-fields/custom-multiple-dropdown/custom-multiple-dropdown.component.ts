import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-multiple-dropdown',
  templateUrl: './custom-multiple-dropdown.component.html',
  styleUrls: ['./custom-multiple-dropdown.component.scss']
})
export class CustomMultipleDropdownComponent implements  OnInit, OnChanges {

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() shortListed: any | null = []
  @Input() optionsSelected: any = [];
  @Input() options: string[] = [];
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;
  @Input() readonly?: boolean = false;
  @Output() optionChanged = new EventEmitter<string[] | []>();

  selectAll: boolean = false;

  constructor(private translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.translate.use('pt-br');
  }

  ngOnInit(): void {
    this.updateSelectAllState();
  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes['shortListed']) {
      this.optionsSelected = changes['shortListed'].currentValue;
    }
    this.updateSelectAllState();
  }


  selected(): boolean {
    return this.optionsSelected ? true : false;
  }

  validator(): boolean {
    if (this.required == true && this.changed && !this.optionsSelected) {
      return true;
    } else {
      return false;
    }
  }

  clear() {
    this.optionsSelected = [];
  }

  selectAllItems(selectAll: boolean) {
    if (typeof this.options[0] === 'string') {
      this.optionsSelected = selectAll ? this.options.slice() : [];
    }
    this.selectAll = selectAll;
  }

  showCheckedIcon(item: string): boolean {
    return this.optionsSelected && this.optionsSelected.includes(item);
  }

  showAllCheckedIcon(): boolean {
    return this.options && this.optionsSelected && this.optionsSelected.length === this.options.length;
  }

  toggleAllCheckedIcon() {
    this.selectAllItems(!this.selectAll);
  }

  updateSelectAllState() {
    if (this.options && this.optionsSelected) {
      if (this.optionsSelected.length !== this.options.length) {
        this.selectAll = false;
      } else if (!this.selectAll && this.optionsSelected.length === this.options.length) {
        this.selectAll = true;
      }
    }
  }
}
