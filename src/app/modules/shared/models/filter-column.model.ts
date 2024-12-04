export interface ColumnFilter {
  nome: string,
  coluna: string,
  tipo: 'String' | 'Boolean' | 'PickList' | 'Number',
  valores: any[]
}

export interface SearchColumnFilter {
  columnParams: ColumnFilter,
  search: any,
  typeSearch: 'Contains' | '==',
}

export interface RequestFilterColumn {
  coluna: string,
  operacao: string,
  valor: string,
}


