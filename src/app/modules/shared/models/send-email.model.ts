import { Modules } from "../consts/list-modules.const";
import { KeyValue } from "./key-value.model";

export class DataSendEmail {
  remetente: string = '';
  destinatario: string = '';
  copia: string = '';
  assunto: string = '';
  corpoEmail: string = '';
  anexos: string[] = [];
}

export interface ConfigurationEmail {
  remetente: string,
  destinatario: string[],
  assunto: string,
  corpoEmail: string,
  anexosSelecionados: string[],
  anexos: string[],
}

interface SendEmail {
  modulo: Modules,
  remetente: string,
  copia: string[],
}

export interface SendEmailSingle extends SendEmail {
  parametros: KeyValue[],
  destinatario: string[],
  assunto: string,
  corpoEmail: string
  anexos: string[]
}

export interface SendEmailMultiple extends SendEmail {
  parametros: KeyValue[][],
}
