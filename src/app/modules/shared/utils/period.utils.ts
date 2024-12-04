import { PeriodsFilter } from "../consts/periods-filter.const";
import { PeriodDateFilter } from "../models/period-date.model";
import { formatDateStringUTC } from "./date-utils";

/** Retorna um intervalo de duas datas de acordo com um período (PeriodsFilter).  */
export function setPeriod(period: PeriodsFilter): PeriodDateFilter {
  const dateNow = new Date();
  const pastDate = new Date();

  if (period == PeriodsFilter.Week) {
    pastDate.setDate(dateNow.getDate() - 7);
  }

  if (period == PeriodsFilter.Month) {
    pastDate.setMonth(dateNow.getMonth() - 1);
  }

  if (period == PeriodsFilter.Semester) {
    pastDate.setMonth(dateNow.getMonth() - 6);
  }

  if (period == PeriodsFilter.Year) {
    pastDate.setMonth(dateNow.getMonth() - 12);
  }

  const newPeriod: PeriodDateFilter = {
    initDate: formatDateStringUTC(pastDate.toUTCString()),
    finalDate: formatDateStringUTC(dateNow.toUTCString()),
    period: period
  }

  return newPeriod;
}

/** Retorna um período de uma semana de acordo com a data atual. */
export function setWeekDate(): PeriodDateFilter {
  const dateNow = new Date();
  const pastDate = new Date();

  pastDate.setDate(dateNow.getDate() - 7);

  const period: PeriodDateFilter = {
    initDate: formatDateStringUTC(pastDate.toUTCString()),
    finalDate: formatDateStringUTC(dateNow.toUTCString()),
    period: PeriodsFilter.Week
  }

  return period;
}

/** Retorna a data do dia atual (Ex.: 2010-10-20). */
export function getDateNow(): string {
  const dateNow = new Date();
  const today: string = formatDateStringUTC(dateNow.toUTCString());

  return today;
}

/** Verifica se a data e/ou hora são futuras. */
export function isFutureDate(date: string, time?: string): boolean {
  if (!time) time = '00:00';

  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  const dateTime = new Date(year, month - 1, day, hours, minutes);

  const now = new Date();

  return dateTime > now;
}

/** Verifica se a data e/ou hora são do passado. */
export function isPastDate(date: string, time?: string): boolean {
  let hasTime: boolean = true;
  if (!time) {
    time = '00:00';
    hasTime = false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  const dateTime = new Date(year, month - 1, day, hours, minutes);

  const now = new Date();
  if (!hasTime) now.setHours(0, 0, 0, 0);

  return dateTime < now;
}

/** Verifica se o ano é menor que 1900. 
 * @param dateString  String representando a data no formato `YYYY-MM-DD`.
 * @returns  Retorna `true` se o ano for anterior a 1900; caso contrário, retorna `false`.
*/
export function isYearBefore1900(dateString: string): boolean {
  if(dateString == null || dateString == '' || dateString.length != 10){
    return false;
  }
  const dateParts = dateString.split('-'); 
  const year = parseInt(dateParts[0], 10);
  return year < 1900;
}
/** Converte data BR para padrão DateTime 
 * @param date String representando a data no formato `DD/MM/YYYY`.
 * @returns  String de data formatada no formato `YYYY-MM-DD`, ou uma string vazia se a entrada não for válida.
*/
export function convertDateFormat(date: string): string {
  if(date == null || date == '' || date.length != 10){
    return  '';
  }
  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/** Converte string no formato dd/MM/yyyy para objetos "Date"
 * @param  dateString  String representando a data no formato `DD/MM/YYYY`.
 * @returns Um objeto `Date` criado a partir da string de data.
 */
export function convertStringToDate(dateString: string): Date {
  return new Date(dateString.split('/').reverse().join('-'));
}

/** Converte uma hora no formato "HH:MM" para o equivalente em minutos. 
 * @param time String representando a hora no formato HH:MM.
 * @returns O número total de minutos correspondentes ao horário fornecido.
*/
export function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
}

/** Verifica se a hora inicial é maior que a hora final. (Hoje utilizado para validações em coleta) */
export function initTimeIsBigger(timeInit: string, timeFinal: string): boolean {
  const [hoursInit, minutesInit] = timeInit.split(':').map(Number);
  const [hoursFinal, minutesFinal] = timeFinal.split(':').map(Number);

  const newTimeInit = new Date();
  const newTimeFinal = new Date();

  newTimeInit.setHours(hoursInit, minutesInit);
  newTimeFinal.setHours(hoursFinal, minutesFinal);

  return newTimeInit > newTimeFinal;
}
