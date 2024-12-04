import { RequestFilterColumn } from "../../shared/models/filter-column.model";

export interface ParamsListGrid {
  page: number;
  take: number;
  search: string;
  columns: string[];
  status?: number | string | null;
  tipoData?: number | string | null;
  dataInicial?: string | null;
  dataFinal?: string | null;
  filtros: RequestFilterColumn[];
}
