import { ColumnSlickGrid } from "../models/column-slickgrid.model";

/** Retorna as configurações de colunas a ser aplicada no GRID. */
export function setDynamicColumnsGrid(columns: ColumnSlickGrid[], columnsBackend: ColumnSlickGrid[]): ColumnSlickGrid[] {
  if (columns.length >= 1) {
    for (const column of columnsBackend) {
      const exist = columns.find(x => x.id === column.id);
      if (!exist) {
        columns.push(column);
      } else {
        const index = columns.findIndex(x => x.id === column.id);
        columns[index].name = column.name;
      }
    }
  } else {
    columns = columnsBackend;
  }

  const columnsToRemove: ColumnSlickGrid[] = []
  for (const column of columns) {
    const exist = columnsBackend.findIndex(x => x.id === column.id);
    if (exist === -1) {
      const index = columns.findIndex(x => x.id === column.id);
      columnsToRemove.push(columns[index])
    }
  }

  let filteredColumns: ColumnSlickGrid[] = [];
  if (columnsToRemove.length >= 1) {
    filteredColumns = columns.filter(column => {
      return !columnsToRemove.some(columnRemove => columnRemove.id === column.id);
    });
  } else {
    filteredColumns = columns;
  }

  return filteredColumns;
}

/** Retorna as colunas que não são padrões no GRID. */
export function setDefaultViewGrid(defaultColumns: string[], columnsBackend: ColumnSlickGrid[]): string[] {
  const columnsHide: string[] = [];

  for (const column of columnsBackend) {
    const isDefault = defaultColumns.findIndex(columnDefault => columnDefault === column.id);
    if (isDefault === -1) columnsHide.push(column.id);
  }

  return columnsHide;
}
