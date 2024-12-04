import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Measure } from '../../../models/measure.model';
import { TableSimpleGridComponent } from 'src/app/modules/shared/components/tables/table-simple-grid/table-simple-grid.component';

@Component({
  selector: 'app-modal-define-measure',
  templateUrl: './modal-define-measure.component.html',
  styleUrls: ['./modal-define-measure.component.scss']
})
export class ModalDefineMeasureComponent implements OnInit {

  columns: ColumnSlickGrid[] = [];
  measure: Measure = <Measure>{};
  measures: Measure[] = [];
  total: number = 0;
  tableVisible: boolean = true;
  @ViewChild(TableSimpleGridComponent) table!: TableSimpleGridComponent;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    translate.use('pt-br')

    this.getHeaderTable();
  }

  ngOnInit(): void {
    if (this.measures.length >= 1) this.getTotal();
  }

  getHeaderTable() {
    this.columns = [
      { name: 'Quantidade', id: 'quantidade', width: 116 },
      { name: 'Altura', id: 'altura', width: 116 },
      { name: 'Largura', id: 'largura', width: 116 },
      { name: 'Comprimento', id: 'comprimento', width: 116 },
      { name: 'M³', id: 'm3', width: 50 },
    ]
  }

  close() {
    this.modal.close();
  }

  applyMeasure() {
    if (!this.measure.quantidade || !this.measure.altura || !this.measure.largura || !this.measure.comprimento) return;

    const newMeasure: Measure = {
      quantidade: Number(this.measure.quantidade),
      altura: this.measure.altura,
      largura: this.measure.largura,
      comprimento: this.measure.comprimento,
      m3: (this.measure.altura * this.measure.largura * this.measure.comprimento) * this.measure.quantidade,
      id: this.measures.length
    };

    newMeasure.m3 = Number(newMeasure.m3.toFixed(2));
    this.measures.push(newMeasure);
    this.table.updateDataset(this.measures);
    this.getTotal();
    this.clearMeasure();
  }

  getTotal() {
    this.total = 0;
    for(const measure of this.measures) {
      this.total += measure.m3;
    }
  }

  clearMeasure() {
    this.measure = { id: 0, quantidade: 0, altura: 0, largura: 0, comprimento: 0, m3: 0 };
  }

  toStringBr(x: number) {
    return x.toLocaleString('pt-BR')
  }

  deleteMeasure(measureToDelete: any) {
    this.measures.splice(this.measures.indexOf(measureToDelete), 1)
    this.getTotal();
    this.table.updateDataset(this.measures);
  }

  confirm() {
    let result = {
      m3: this.total,
      medidas: this.measures,
    };
    this.modal.close(result);
  }
}
