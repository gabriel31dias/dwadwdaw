import { PeriodsFilter } from "../consts/periods-filter.const";

export interface PeriodDateFilter {
  initDate: string | null;
  finalDate: string | null;
  period: PeriodsFilter | null;
}
