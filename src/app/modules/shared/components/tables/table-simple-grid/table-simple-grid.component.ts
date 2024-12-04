import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { AngularGridInstance, Column, GridOption, GridStateChange, SlickGrid } from 'angular-slickgrid';

import { ColumnSlickGrid } from '../../../models/column-slickgrid.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table-simple-grid',
  templateUrl: './table-simple-grid.component.html',
  styleUrls: ['./table-simple-grid.component.scss']
})
export class TableSimpleGridComponent implements OnInit, OnChanges {

  angularGrid: AngularGridInstance = <AngularGridInstance>{};
  columnDefinitions: Column[] = [];
  dataviewObj: any;
  gridObj: any;
  gridOptions!: GridOption;
  grid!: SlickGrid;

  @Input() columnsHeader: ColumnSlickGrid[] = [];
  @Input() columnsHide: string[] = [];
  @Input() dataset: any[] = [];
  @Output() columnsChanges = new EventEmitter<any>();
  compareColumns: any;
  @Output() rowSelected = new EventEmitter<any>();
  @Output() confirmSelected = new EventEmitter<any>();
  indexSelected: any;

  @Input() enableRowSelection: boolean = false;
  @Input() enableActionRow: boolean = false;
  @Input() fitColumns: boolean = false;
  @Input() enableEdit: boolean = false;
  @Input() enableDelete: boolean = false;
  @Input() enableMenu: boolean = true;
  @Output() dataToEdit = new EventEmitter<any>();
  @Output() dataToDelete = new EventEmitter<any>();
  @Input() idGrid: string = 'simple-grid';
  @Input() heightGrid: number = 100;
  @Input() forceHeightGrid: number | null = null;
  @Input() enableCheckbox: boolean = false;
  @Output() checkboxSelected = new EventEmitter<any>();
  compareCheckboxSelected: any;
  @Output() rowClicked = new EventEmitter<any>();

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

  ngOnChanges(changes: SimpleChanges) {
  }

  updateDataset(newData: any) {
    this.dataset = newData;
    this.grid.setData(newData);
    this.grid.render();
  }

  editFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any): string {
    const iconEdit = `<button class="icon-edit-grid" (click)="editItem(${dataContext.id})"></button>`;
    return iconEdit;
  }

  deleteFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any): string {
    const iconDelete = `<button class="icon-cancel-grid" (click)="deleteItem(${dataContext.id})"></button>`;
    return iconDelete;
  }

  enableFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any): string {
    if (dataContext.habilitado === 'Habilitado') {
      return `
        <div class="field-enabled-grid" [ngClass]="${dataContext.habilitado}">
          <img src="../../../../../../assets/icons/check-circle.svg">
          ${dataContext.habilitado}
        </div>
      `;
    } else {
      return `
        <div class="field-disabled-grid">
          <img src="../../../../../../assets/icons/cancel-red.svg" width="16">
          ${dataContext.habilitado}
        </div>
      `;
    }
  }

  angularGridReady(event: Event) {
    this.angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.grid = this.angularGrid.slickGrid as SlickGrid;
    this.gridObj = this.angularGrid.slickGrid;
    this.dataviewObj = this.angularGrid.dataView;

    if (this.enableRowSelection === true) {
      this.gridObj.onKeyDown.subscribe((e: KeyboardEvent) => {
        if (e.which == 13) {
          this.emitSelected();
        }
      });

      this.gridObj.onDblClick.subscribe((event: Event, args: any) => {
        this.emitSelected();
      });
    }
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

    if (this.enableEdit) {
      this.columnDefinitions.push({
        id: 'actions',
        name: '',
        field: '',
        formatter: this.editFormatter,
        width: 50,
        minWidth: 50,
        maxWidth: 50,
        headerCssClass: 'slick-header-column',
        cssClass: 'cell-icon-action',
        onCellClick: (e, args) => {
          this.dataToEdit.emit(args.dataContext);
        },
        excludeFromColumnPicker: true,
        excludeFromHeaderMenu: true,
        resizable: false,
      });
    }

    if (this.enableDelete) {
      this.columnDefinitions.push({
        id: 'actions',
        name: '',
        field: '',
        formatter: this.deleteFormatter,
        width: 50,
        minWidth: 50,
        maxWidth: 50,
        headerCssClass: 'slick-header-column',
        cssClass: 'cell-icon-action',
        onCellClick: (e, args) => {
          this.dataToDelete.emit(args.dataContext);
        },
        excludeFromColumnPicker: true,
        excludeFromHeaderMenu: true,
        resizable: false,
      });
    }

    for (const column of this.columnDefinitions) {
      if (column.id === 'habilitado') {
        column.formatter = this.enableFormatter
      }
    }
  }

  defineGrid() {
    for (const data of this.dataset) {
      if (this.heightGrid !== 260) {
        this.heightGrid = this.heightGrid + 40;
      }
    }

    const simpleGrid = this.elementRef.nativeElement.querySelector('.simple-grid');
    let slickWidth: number = 0;
    let totalColumnsWidth: number = 0;

    if (simpleGrid) {
      slickWidth = simpleGrid.offsetWidth;
    }

    for (const column of this.columnDefinitions) {
      if (column.width) {
        totalColumnsWidth = totalColumnsWidth + column.width;
      }
    }

    if (this.fitColumns) {
      this.heightGrid = this.heightGrid + 5;
    } else {
      if (slickWidth < totalColumnsWidth) {
        this.heightGrid = this.heightGrid + 22
      }
    }

    if (this.dataset.length < 6) {
      this.heightGrid = this.heightGrid - 40;
    }

    this.heightGrid = this.heightGrid + 20;

    this.gridOptions = {
      autoResize: {
        container: '#' + this.idGrid,
        resizeDetection: 'container',
        calculateAvailableSizeBy: 'container',
        minHeight: 130,
      },
      gridHeight: this.forceHeightGrid !== null ? this.forceHeightGrid : this.heightGrid,
      enableAutoResize: true,
      enableTranslate: true,
      i18n: this.translate,
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,
      rowHeight: 40,
      headerRowHeight: 50,
      enableDraggableGrouping: false,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      enableSorting: true,
      showCustomFooter: false,
      enableExcelExport: false,
      enableGrouping: false,
      enableCellNavigation: this.enableRowSelection,
      enableRowSelection: this.enableRowSelection,
      forceFitColumns: this.fitColumns,
      enableGridMenu: this.enableMenu,
      enableHeaderMenu: this.enableMenu,
      enableEmptyDataWarningMessage: false,
      enableCheckboxSelector: this.enableCheckbox,
      checkboxSelector: {
        cssClass: 'checkbox-slickgrid',
        width: 40
      },
    };
  }

  customHideColumns(columnsIds: string[]) {
    for (const columnId of columnsIds) {
      setTimeout(() => {
        this.angularGrid.gridService.hideColumnById(columnId, { autoResizeColumns: false });
      }, 1)
    }
  }

  gridStateChanged(event: Event) {
    const gridStateChanges = (event as CustomEvent).detail as GridStateChange;
    const configColumns = gridStateChanges.gridState?.columns;
    const idsSelected = gridStateChanges.gridState?.rowSelection?.dataContextIds;

    if (this.enableRowSelection === true) {
      this.indexSelected = gridStateChanges.gridState?.rowSelection?.dataContextIds;
      this.rowSelected.emit(this.indexSelected);
    }

    if (!this.compareColumns) {
      this.compareColumns = configColumns;
      this.columnsChanges.emit(configColumns)
    } else {
      if (JSON.stringify(this.compareColumns) !== JSON.stringify(configColumns)) {
        this.compareColumns = configColumns;
        this.columnsChanges.emit(configColumns)
      }
    }

    // Retorna os ids de checkbox selecionados.
    if (!this.compareCheckboxSelected) {
      this.compareCheckboxSelected = idsSelected;
      const dataSelected: any[] = [];
      for (const index of idsSelected!) {
        this.dataset.forEach(data => {
          if (data.id === index) {
            dataSelected.push(data)
          }
        });
      }

      this.checkboxSelected.emit(dataSelected)
    } else {
      if (JSON.stringify(this.compareCheckboxSelected) !== JSON.stringify(idsSelected)) {
        const dataSelected: any[] = [];
        for (const index of idsSelected!) {
          this.dataset.forEach(data => {
            if (data.id === index) {
              dataSelected.push(data)
            }
          });
        }

        this.checkboxSelected.emit(dataSelected)
        this.compareCheckboxSelected = idsSelected;
      }
    }
  }

  emitSelected() {
    this.confirmSelected.emit();
  }

  unselectAll() {
    this.gridObj.setSelectedRows([]);
  }

}
