import { RequestFilterColumn } from "../../shared/models/filter-column.model";

export interface ParamsListConference {
  page: number;
  take: number;
  search: string;
  columns: string[];
  status?: number | null;
  tipoData?: number | null;
  dataInicial?: string | null;
  dataFinal?: string | null;
  filtros: RequestFilterColumn[];
}
