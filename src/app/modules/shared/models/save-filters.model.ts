import { RequestFilterColumn, SearchColumnFilter } from "./filter-column.model";
import { PeriodDateFilter } from "./period-date.model";

export interface SaveFilters {
  page: number;
  take: number;
  search: string;
  typeDate: number | null;
  status: number | null;
  advancedFilter: AdvancedFilter;
  period: PeriodDateFilter | null;
}

export interface AdvancedFilter {
  request: RequestFilterColumn[];
  configFilters: SearchColumnFilter[];
}
