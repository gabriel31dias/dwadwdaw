/** Função para formatar data do tipo "Tue, 04 Jul 2023 17:47:01 GMT" para YYYY-MM-DD */
export function formatDateStringUTC(date: string) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

/** Função para formatar data do tipo "Tue, 04 Jul 2023 17:47:01 GMT" para DD/MM/AAAA */
export function formatDateToStringBR(date: Date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [day, month, year].join('/');
}

/** Função para formatar data do tipo "Tue, 04 Jul 2023 17:47:01 GMT" para DD/MM/AAAA */
export function formatDateToStringUTC(date: Date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

/** Função para formatar data do tipo string (YYYY-MM-DD) para Date */
export function formatStringUTCToDate(date: string): Date | null {
  if (date && date.length === 10) {
    const [year, month, day] = date.split('-').map(Number);

    const newDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return newDate;
  }

  return null;
}

/** Função para formatar data do tipo YYYY-MM-DD para DD/MM/AAAA */
export function formatDateUtcToBr(date: string | null) {
  if (date !== null && date !== '') {
    const year: string = date.split("-")[0];
    const month: string = date.split("-")[1];
    const day: string = date.split("-")[2];

    const newDate: string = `${day}/${month}/${year}`;

    return newDate;
  } else {
    return '';
  }
}

/** Função para formatar data do tipo DD/MM/AAAA para YYYY-MM-DD */
export function formatDateBrToUtc(date: string | null) {
  if (date) {
    let day: string = date.split("/")[0];
    let month: string = date.split("/")[1];
    const year: string = date.split("/")[2];

    day = implementZero(day);
    month = implementZero(month);

    const newDate: string = `${year}-${month}-${day}`;

    return newDate;
  } else {
    return '';
  }
}

/** Função para formatar a data da máscara de input (13072023 => 13/07/2023) */
export function formatDateMask(date: string | null) {
  if (date !== null && date !== '') {
    const day = date.substr(0, 2);
    const month = date.substr(2, 2);
    const year = date.substr(4, 4);

    const newDate: string = `${day}/${month}/${year}`;

    return newDate;
  } else {
    return '';
  }
}

/** Função para formatar a hora da máscara de input (103049 => 10:30:49) */
export function formatTimeMask(time: string | null) {
  if (time !== null && time !== '') {
    let newTime: string = '';
    const hour = time.substr(0, 2);
    newTime += hour;

    if (time.length >= 4) {
      const minutes = time.substr(2, 2);
      newTime += `:${minutes}`;
    }

    if (time.length >= 6) {
      const seconds = time.substr(4, 2);
      newTime += `:${seconds}`;
    }

    return newTime;
  } else {
    return '';
  }
}

/** Função para transformar a data string do tipo "30/12/2023 - 23:30:45" em para "2023-12-30T23:30:45" */
export function formatDateTimeString(dateTime: string | null): string | null {
  if (dateTime) {
    const [date, time] = dateTime.split(' - ');
    let [day, month, year] = date.split('/');
    let [hours, minutes, seconds] = time.split(':');

    day = implementZero(day);
    month = implementZero(month);
    hours = implementZero(hours);
    minutes = implementZero(minutes);
    seconds = implementZero(seconds);

    const newDate: string = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return newDate;
  }

  return null;
}

/** Função para transformar a data string do tipo "2023-12-30T23:30:45" para "30/12/2023 - 23:30:45" */
export function formatDateBack(dateTime: string | null): string | null {
  if (dateTime !== null && dateTime !== '') {
    const [datePart, timePart] = dateTime.split('T');
    const [year, month, day] = datePart.split('-');
    let [hours, minutes, seconds] = timePart.split(':');

    // Remove os milisegundos, caso tenha.
    if (seconds.length > 2) {
      seconds = seconds.split('.')[0];
    }

    const formattedDate: string = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  return null;
}

/** Função para transformar a data string do tipo "2023-12-30T23:30:45" para "30/12/2023" */
export function formatOnlyDateBack(dateTime: string | null): string | null {
  if (dateTime) {
    const dateAndTime = formatDateBack(dateTime);

    const [ date, time ] = dateAndTime!.split(' - ');

    return date;
  }

  return dateTime;
}

export function implementZero(value: string): string {
  if (value.length == 1) {
    return '0' + value
  } else {
    return value
  }
}


/** Formata a data UTC para PT-BR. ("2023-11-16T14:04:27.173" - "16/11/2023, 11:04:27") */
export function utcToPtBR(dateTime: string): string {
  const dataUTCObj = new Date(dateTime);
  dataUTCObj.setUTCHours(dataUTCObj.getUTCHours() - 3);
  const dateTimeBR = dataUTCObj.toLocaleString('pt-BR');

  return dateTimeBR;
}

/** Verifica se a data é valida (padrão a ser verificado: DD/MM/AAAA) */
export function isValidDate(dateString: string): boolean {
  // Verifica o formato da string
  const dateRegex1 = /^\d{2}\/\d{2}\/\d{4}$/;
  const dateRegex2 = /^\d{1}\/\d{1}\/\d{4}$/;
  const dateRegex3 = /^\d{2}\/\d{1}\/\d{4}$/;
  const dateRegex4 = /^\d{1}\/\d{2}\/\d{4}$/;

  if (!dateRegex1.test(dateString) &&
    !dateRegex2.test(dateString) &&
    !dateRegex3.test(dateString) &&
    !dateRegex4.test(dateString)
  ) {
    return false;
  }

  // Extrai o dia, mês e ano.
  const [day, month, year] = dateString.split('/').map(Number);

  if (month > 12) return false;
  if (day > 31) return false;

  return true;
}

/** Retorna a Time Zone do usuário.
 *
 * Ex.: BRT (Time Zone) --> 180 (Retorno)
 */
export function getTimeZone(): number {
  const now: Date = new Date();

  return now.getTimezoneOffset()
}

/** Formata um date string UTC para o formato BR de acordo com a TimeZone do usuário.
 *
 * Ex.: O usuário está com o fuso de Brasília (UTC-03:00):
 *
 * (Envio) 2024-07-01T19:53:06.127 --> 01/07/2024 - 16:53:06 (Retorno)
 */
export function formatUTCToLocal(utcString: string): string {
  const date = new Date(utcString);
  const dateTimezone = new Date();

  const timezone = dateTimezone.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - timezone);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

