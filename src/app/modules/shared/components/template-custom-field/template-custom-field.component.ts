import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeCustomField } from 'src/app/modules/settings/models/type-custom-field';
import { ExhibitionCustomField } from '../../models/exhibition-custom-field.model';
import { SizeCustomField } from 'src/app/modules/settings/models/size-custom-field';

@Component({
  selector: 'app-template-custom-field',
  templateUrl: './template-custom-field.component.html',
  styleUrls: ['./template-custom-field.component.scss']
})
export class TemplateCustomFieldComponent implements OnInit {

  @Input() fields: ExhibitionCustomField[] = [];
  @Output() fieldsEmitter = new EventEmitter<ExhibitionCustomField[]>();
  TypeCustomField = TypeCustomField;
  SizeCustomField = SizeCustomField;

  ngOnInit(): void {
  }

  updateFieldValue(codigo: number, updatedValue: any): void {
    const index = this.fields.findIndex(field => field.codigo === codigo);
    if (index !== -1) {
      this.fields[index].valor = updatedValue;

      this.fieldsEmitter.emit(this.fields);
    }
  }

}

