import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { AngularGridInstance, Column, GridOption, GridStateChange, SlickGrid } from 'angular-slickgrid';

import { ColumnSlickGrid } from '../../../models/column-slickgrid.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table-grid-secondary',
  templateUrl: './table-grid-secondary.component.html',
  styleUrls: ['./table-grid-secondary.component.scss']
})
export class TableGridSecondaryComponent implements OnInit {

  angularGrid: AngularGridInstance = <AngularGridInstance>{};
  columnDefinitions: Column[] = [];
  gridObj: any;
  gridOptions!: GridOption;
  grid!: SlickGrid;
  @Input() columnsHeader: ColumnSlickGrid[] = [];
  @Input() columnsHide: string[] = [];
  @Input() dataset: any[] = [];
  @Output() columnsChanges = new EventEmitter<any>();
  compareColumns: any;
  @Output() rowsSelected = new EventEmitter<any>();
  compareRowsSelected: any;
  @Output() confirmSelected = new EventEmitter<any>();
  @Input() enableMenu: boolean = true;
  @Input() idGrid: string = 'grid-secondary';
  @Input() heightGrid: number = 300;
  @Input() enableCheckbox: boolean = false;
  @Output() rowClicked = new EventEmitter<any>();
  @Input() enableReset: boolean = false;
  @Output() resetGrid = new EventEmitter<boolean>();

  constructor(private translate: TranslateService,
    private elementRef: ElementRef,
  ) {
    this.translate.use('pt-br');
  }

  ngOnInit(): void {
    this.defineColumns();
    this.defineGrid();
    if (this.columnsHide.length >= 1) {
      this.customHideColumns(this.columnsHide);
    }
  }

  updateDataset(newData: any[]) {
    if (this.grid && this.angularGrid?.dataView) {
      this.angularGrid.dataView.setItems(newData);
      this.grid.invalidate();
    }
  }
  angularGridReady(event: Event) {
    this.angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.grid = this.angularGrid.slickGrid as SlickGrid;
    this.gridObj = this.angularGrid.slickGrid;
  }

  defineColumns() {
    for (const columnHeader of this.columnsHeader) {
      let column: Column = <Column>{};
      column = {
        id: columnHeader.id, name: columnHeader.name, field: columnHeader.id,
        width: columnHeader.width,
        sortable: true,
        onCellClick: (e, args) => {
          this.rowClicked.emit(args.dataContext);
        }
      }

      this.columnDefinitions.push(column)
    }
  }

  defineGrid() {
    this.gridOptions = {
      autoResize: {
        container: '#' + this.idGrid,
        resizeDetection: 'container',
        calculateAvailableSizeBy: 'container'
      },
      gridHeight: 300,
      enableAutoResize: true,
      enableTranslate: true,
      i18n: this.translate,
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,
      rowHeight: 40,
      headerRowHeight: 30,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      showCustomFooter: false,
      enableSorting: true,
      enableCellNavigation: false,
      enableRowSelection: false,
      gridMenu: {
        commandItems: [
          {
            title: 'Restaurar GRID padrão',
            command: 'reset-grid',
            positionOrder: 91,
            iconCssClass: 'option-revert-default',
            action: (_e: Event, args: any) => {
              this.resetGrid.emit(true)
            },
          }
        ]
      },
      enableHeaderMenu: this.enableMenu,
      enableEmptyDataWarningMessage: false,
      enableCheckboxSelector: this.enableCheckbox,
      checkboxSelector: {
        cssClass: 'checkbox-slickgrid',
        width: 40
      },
      enableExcelExport: false
    };
  }

  customHideColumns(columnsIds: string[]) {
    setTimeout(() => {
      for (const columnId of columnsIds) {
        this.angularGrid.gridService.hideColumnById(columnId, { autoResizeColumns: false });
      }
    }, 1);
  }

  gridStateChanged(event: Event) {
    const gridStateChanges = (event as CustomEvent).detail as GridStateChange;
    const configColumns = gridStateChanges.gridState?.columns;
    const idsSelected =  gridStateChanges.gridState?.rowSelection?.dataContextIds;

    if (!this.compareColumns) {
      this.compareColumns = configColumns;
      this.columnsChanges.emit(configColumns)
    } else {
      if (JSON.stringify(this.compareColumns) !== JSON.stringify(configColumns)) {
        this.compareColumns = configColumns;
        this.columnsChanges.emit(configColumns)
      }
    }

    if (!this.compareRowsSelected) {
      this.compareRowsSelected = idsSelected;
      const dataSelected: any[] = [];
      for (const index of idsSelected!) {
        this.dataset.forEach(data => {
          if (data.id === index) {
            dataSelected.push(data)
          }
        });
      }

      this.rowsSelected.emit(dataSelected)
    } else {
      if (JSON.stringify(this.compareRowsSelected) !== JSON.stringify(idsSelected)) {
        const dataSelected: any[] = [];
        for (const index of idsSelected!) {
          this.dataset.forEach(data => {
            if (data.id === index) {
              dataSelected.push(data)
            }
          });
        }

        this.rowsSelected.emit(dataSelected)
        this.compareRowsSelected = idsSelected;
      }
    }
  }

  unselectAll() {
    this.gridObj.setSelectedRows([]);
  }

}
