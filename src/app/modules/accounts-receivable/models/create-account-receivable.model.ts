import { RegisterCustomField } from "../../shared/models/exhibition-custom-field.model";

export interface CreateAccountReceivable {
  dataEmissao: string;
  valorFatura: number;
  valorLiquido: number;
  cnpjCliente: string;
  cdBanco: string;
  cdConta: string;
  cdCondicaoPagamento: string;
  dataVencimento: string
  cdGrupoReceita: string;
  cdContaReceita: string;
  cdFilialCobranca: string;
  cdCentroCustos: string;
  observacao: string;
  observacoesInternas: string;
  documentosDeFrete: FreightDocument[];
  noFatura?: string;
  camposPersonalizados?: RegisterCustomField[] | null;
}

export interface FreightDocument {
  noCTRC: number;
  cdFilEmp: string;
  cdEmpresa: string;
}
