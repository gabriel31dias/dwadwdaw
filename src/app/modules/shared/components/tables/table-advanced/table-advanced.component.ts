import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularGridInstance, Column, GridOption, GridStateChange } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';

import { ColumnSlickGrid } from '../../../models/column-slickgrid.model';

@Component({
  selector: 'app-table-advanced',
  templateUrl: './table-advanced.component.html',
  styleUrls: ['./table-advanced.component.scss']
})
export class TableAdvancedComponent implements OnInit {

  angularGrid: AngularGridInstance = <AngularGridInstance>{};
  columnDefinitions: Column[] = [];
  gridObj: any;
  gridOptions!: GridOption;
  @Input() columnsHeader: ColumnSlickGrid[] = [];
  @Input() columnsHide: string[] = [];
  @Input() dataset: any[] = [];
  @Output() columnsChanges = new EventEmitter<any>();
  compareColumns: any;
  @Output() rowsSelected = new EventEmitter<any>();
  compareRowsSelected: any;
  @Output() rowClicked = new EventEmitter<any>();
  @Input() idGrid: string = 'advanced-slickgrid';
  @Input() enableReset: boolean = false;
  @Output() resetGrid = new EventEmitter<boolean>();
  @Output() dataToEdit = new EventEmitter<any>();
  @Output() idSelected = new EventEmitter<any>();
  @Output() confirmSelected = new EventEmitter<any>();

  /** Construtor da classe `TableAdvancedComponent`.
   * @param translateService Service responsável pela tradução do sistema.
  */
  constructor(private translate: TranslateService) {
    this.translate.use('pt-br');
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    this.defineColumns();
    this.defineGrid();
    if (this.columnsHide.length >= 1) {
      setTimeout(() => {
        this.customHideColumns(this.columnsHide);
      }, 0);
    }
  }

  /** Inicializa a instância da grid e configura os eventos de teclado e duplo clique.
   * @param event Evento disparado pelo SlickGrid, contendo os detalhes da instância do GRID.
  */
  angularGridReady(event: Event) {
    this.angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.gridObj = this.angularGrid.slickGrid;

    this.gridObj.onKeyDown.subscribe((e: KeyboardEvent) => {
      if (e.which == 13) {
        this.emitSelected();
      }
    });

    this.gridObj.onDblClick.subscribe((event: Event, args: any) => {
      this.emitSelected();
    });
  }

  /** Emite um alerta para o componete pai. */
  emitSelected() {
    this.confirmSelected.emit();
  }

  /** Define as configurações de colunas do GRID. */
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

  /** Torna fixa uma quantidade de colunas do GRID de acordo com o parâmetro passado.
   * @param frozenCols Quantidade de colunas a serem congeladas (fixas).
  */
  setFrozenColumns(frozenCols: number) {
    this.gridObj.setOptions({ frozenColumn: frozenCols });
    this.gridOptions = this.gridObj.getOptions();
  }

  /** Define todas as configurações do GRID. */
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
      enableCheckboxSelector: false,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      showCustomFooter: false,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
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
      enableExcelExport: false,
      enablePagination: false
    };
  }

  /**  Método responsável por ocultar colunas no SlickGrid.
   * @param columnsIds Array de strings contendo os IDs das colunas que devem ser ocultadas.
  */
  customHideColumns(columnsIds: string[]) {
    for (const columnId of columnsIds) {
      this.angularGrid.gridService.hideColumnById(columnId, { autoResizeColumns: false });
    }
  }

  /**  Método responsável por lidar com mudanças de estado do GRID.
   * Emite eventos apropriados quando mudanças são detectadas.
  * @param event Evento disparado pelo SlickGrid, contendo o estado atual da grid.
  */
  gridStateChanged(event: Event) {
    const gridStateChanges = (event as CustomEvent).detail as GridStateChange;
    const configColumns = gridStateChanges.gridState?.columns;
    const idsSelected =  gridStateChanges.gridState?.rowSelection?.dataContextIds;

    if (idsSelected?.length) this.idSelected.emit(idsSelected[0]);

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

}
