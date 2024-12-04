import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SizeCustomField } from 'src/app/modules/settings/models/size-custom-field';

@Component({
  selector: 'app-custom-checkbox-input',
  templateUrl: './custom-checkbox-input.component.html',
  styleUrls: ['./custom-checkbox-input.component.scss']
})
export class CustomCheckboxInputComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() size: SizeCustomField = 'Grande';
  @Input() label: string = '';
  @Input() itemsSelected: any = [];
  @Output() entryChanged = new EventEmitter<any[]>();
  SizeCustomField = SizeCustomField;

  selectedIndices = new Set<number>();

  ngOnInit(): void {
    this.itemsSelected.forEach((itemSelected: any) => {
      const index = this.items.findIndex(item => item === itemSelected);
      if (index !== -1) {
        this.selectedIndices.add(index);
      }
    });
  }

  toggleSelection(index: number): void {
    if (this.selectedIndices.has(index)) {
      this.selectedIndices.delete(index);
    } else {
      this.selectedIndices.add(index);
    }
    this.emitSelectedItems();
  }

  emitSelectedItems(): void {
    const selectedItems = this.items.filter((_, index) => this.selectedIndices.has(index));
    this.entryChanged.emit(selectedItems);
  }

}
