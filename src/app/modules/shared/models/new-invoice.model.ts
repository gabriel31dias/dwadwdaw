import { Measure } from "./measure.model";

export interface NovaNotaFiscal {
  nomeFantasiaRemetente: string;
  cnpjRemetente: string;
  cdRemetente?: string;

  nomeFantasiaDestinatario: string;
  cnpjDestinatario: string;
  cdDestinatario?: string;

  nomeFantasiaPagador: string;
  cnpjPagador: string;
  cdPagador?: string;

  tipoDocumento: string;
  chaveDeAcesso: string;
  numNF: string;
  serie: string;
  dataEmissao: string;
  pedido?: string;
  romaneio?: string;
  qtdVolumes: number;
  peso: number | null;
  pesoBruto: number | null;
  m3: number | null;
  medidas?: Measure[];
  valorMercadoria: number | null;
  qtdEtiquetas?: string;

  noNf?: number;
  flImpEtiqueta?: string;
  cdEmpresa?: string;
  cdFilEmp?: string;
}
