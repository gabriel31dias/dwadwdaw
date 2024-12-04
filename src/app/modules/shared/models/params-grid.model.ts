import { RequestFilterColumn } from "../../shared/models/filter-column.model";

export interface ParamsGrid {
  pagina: number;
  quantidade: number;
  busca: string;
  filtros: RequestFilterColumn[];
  status: string | null;
  tipo_data: number | null;
  data_inicial: string | null;
  data_final: string | null;
}
