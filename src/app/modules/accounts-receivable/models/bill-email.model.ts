export interface FaturaEmail {
  options: Options;
  remetente: string;
  destinatario: string;
  assunto: string;
  corpoTexto: string;
}

interface Options {
  fatura: boolean;
  boleto: boolean;
  documentosRelacionados: boolean;
  doccob: boolean;
}
