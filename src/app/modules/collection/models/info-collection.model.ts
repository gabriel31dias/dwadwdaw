import { TypesCollection } from "./types-collection.enum";

export interface DadosColeta {
  nColeta: number;
  dataInclusao: string;
  filialInclusao?: string;
  tipoServico: number | null;
  tipoColeta: TypesCollection;
  cdClienteSolicitante: string;
  cnpjCpfSolicitante: string;
  nomeFantasiaSolicitante: string;

  dataColeta: string;
  horaInicial: string;
  horaFinal: string;
  timeZone: number;

  cdClienteColeta: string;
  cnpjCpfColeta: string;
  nomeFantasiaColeta: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cdCidade: string;
  uf: string | null;
  responsavel: string;
  celular: string;
  email: string;
  cdFilialResponsavel: string;
  filialResponsavel: string;
  observacoes: string;
}

