import { RequestFilterColumn } from "./filter-column.model";

export interface ParamsAdvancedSearchGrid {
  pagina: number;
  quantidade: number;
  codigo_filial?: string;
  busca: string;
  filtros: RequestFilterColumn[];
}
