import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { TextExportService } from '@slickgrid-universal/text-export';
import { AngularGridInstance, Column, GridOption, Grouping, GroupingGetterFunction, GridStateChange, Formatter, SlickGrid } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';

import { ColumnSlickGrid } from '../../../models/column-slickgrid.model';

@Component({
  selector: 'app-table-dinamic-grid',
  templateUrl: './table-dinamic-grid.component.html',
  styleUrls: ['./table-dinamic-grid.component.scss']
})
export class TableDinamicGridComponent implements OnInit, OnChanges {

  angularGrid: AngularGridInstance = <AngularGridInstance>{};
  columnDefinitions: Column[] = [];
  dataviewObj: any;
  draggableGroupingPlugin: any;
  gridObj: any;
  gridOptions!: GridOption;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  excelExportService = new ExcelExportService();
  textExportService = new TextExportService();
  @Input() columnsHeader: ColumnSlickGrid[] = [];
  @Input() columnsHide: string[] = [];
  @Input() dataset: any[] = [];
  @Output() columnsChanges = new EventEmitter<any>();
  compareColumns: any;
  @Output() rowsSelected = new EventEmitter<any>();
  compareRowsSelected: any;
  @Output() rowClicked = new EventEmitter<any>();
  @Input() idGrid: string = 'dinamic-slickgrid';
  heightGrid: number = 100;
  @Output() pageEmitter = new EventEmitter<number>();
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  currentItemsPerPage: number = 100;
  @Output() perPageEmitter = new EventEmitter<number>();
  @Input() enableReset: boolean = false;
  @Output() resetGrid = new EventEmitter<boolean>();
  @Input() disableExport: boolean = false;

  constructor(private translate: TranslateService,
    private elementRef: ElementRef
  ) {
    this.translate.use('pt-br');
  }

  ngOnInit(): void {
    this.defineColumns();
    this.defineGrid();
    if (this.columnsHide.length >= 1) {
      setTimeout(() => {
        this.customHideColumns(this.columnsHide);
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataset'] && this.angularGrid.paginationService) {
      this.setTotalItems();
      this.setPage();
    }
  }

  angularGridReady(event: Event) {
    this.angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.gridObj = this.angularGrid.slickGrid;
    this.dataviewObj = this.angularGrid.dataView;

    this.setTotalItems();
  }

  defineColumns() {
    for (const columnHeader of this.columnsHeader) {
      let column: Column = <Column>{};
      column = {
        id: columnHeader.id, name: columnHeader.name, field: columnHeader.id,
        width: columnHeader.width,
        sortable: true,
        grouping: {
          getter: columnHeader.id,
          formatter: (g) => `${g.value}  <span style="color: #84C55E">(${g.count} itens)</span>`,
          aggregateCollapsed: false,
          collapsed: false
        },
        onCellClick: (e, args) => {
          this.rowClicked.emit(args.dataContext);
        }
      }

      this.columnDefinitions.push(column)
    }
  }

  defineGrid() {
    this.heightGrid = 540;

    this.gridOptions = {
      autoResize: {
        container: '#' + this.idGrid,
        resizeDetection: 'container',
        calculateAvailableSizeBy: 'container'
      },
      gridHeight: this.heightGrid,
      enableAutoResize: true,
      enableTranslate: true,
      i18n: this.translate,
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,
      rowHeight: 40,
      headerRowHeight: 30,
      enableDraggableGrouping: true,
      enableCheckboxSelector: true,
      checkboxSelector: {
        cssClass: 'checkbox-slickgrid',
        width: 40
      },
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      showCustomFooter: true,
      enableSorting: true,
      gridMenu: {
        onCommand: (e, args) => {
          if (args.command === 'toggle-preheader') {
            this.clearGrouping();
          }
        },
        commandItems: [
        ]
      },
      draggableGrouping: {
        dropPlaceHolderText: 'Arraste e solte um cabeçalho de coluna aqui para agrupar',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChanged(args),
        onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      },
      enableExcelExport: !this.disableExport,
      excelExportOptions: {
        sanitizeDataExport: true
      },
      registerExternalResources: [this.excelExportService],
      enablePagination: true,
      pagination: {
        pageSize: this.itemsPerPage,
        pageSizes: [10, 25, 50, 100],
        pageNumber: this.currentPage,
        totalItems: this.totalItems
      },
    };

    if (this.enableReset) {
      this.gridOptions.gridMenu?.commandItems?.push({
        title: 'Restaurar GRID padrão',
        command: 'reset-grid',
        positionOrder: 91,
        iconCssClass: 'option-revert-default',
        action: (_e: Event, args: any) => {
          this.resetGrid.emit(true)
        },
      })
    }
  }

  goToPage(page: number) {
    this.currentPage = this.angularGrid.paginationService?.pageNumber!;
    this.pageEmitter.emit(page);
  }

  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.gridObj.invalidate();
  }

  clearGroupingSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
  }

  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }

  customHideColumns(columnsIds: string[]) {
    for (const columnId of columnsIds) {
      this.angularGrid.gridService.hideColumnById(columnId, { autoResizeColumns: false });
    }
  }

  setTotalItems() {
    setTimeout(() => {
      this.angularGrid.paginationService!.totalItems = this.totalItems;
    }, 0);
  }

  setPage() {
    setTimeout(() => {
      this.angularGrid.paginationService!.goToPageNumber(this.currentPage)
    }, 0);
  }

  gridStateChanged(event: Event) {
    const gridStateChanges = (event as CustomEvent).detail as GridStateChange;
    const configColumns = gridStateChanges.gridState?.columns;
    const idsSelected =  gridStateChanges.gridState?.rowSelection?.dataContextIds;

    this.setTotalItems();

    if (this.angularGrid.paginationService?.pageNumber !== this.currentPage) {
      this.goToPage(this.angularGrid.paginationService?.pageNumber!)
      this.gridObj.setSelectedRows([]);
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
