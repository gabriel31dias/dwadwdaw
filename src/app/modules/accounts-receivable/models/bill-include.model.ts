import { RegisterCustomField } from "../../shared/models/exhibition-custom-field.model";

export interface InclusaoFatura {
  dadosFatura: DadosFatura;
  documentosFrete: any;
  movimentos: any;
}

export interface DadosFatura {
  nFatura: number;
  dataEmissao: string;
  valorFatura: number;
  valorLiquido: number;
  cnpj: string;
  nomeFantasia: string;
  cdCliente: string;
  contaCorrenteAgencia: string | null;
  banco: string | null;
  descricao: string | null;
  dataVencimento: string | null;
  grupoReceita: string | null;
  contaReceita: string | null;
  filialCobranca: string | null;
  centroCustos: string | null;
  observacao: string;
  observacaoInterna: string;

  cdBanco?: string | null;
  cdConta?: string | null;
  cdCondicaoPagamento?: string | null;
  cdGrupoReceita?: string | null;
  cdContaReceita?: string | null;
  cdFilialCobranca?: string | null;
  cdCentroCustos?: string | null;
  status?: string | null;
  dataCancelamento?: string | null;
  motivoCancelamento?: string | null;
  usuarioCancelamento?: string | null;
  dataBaixa?: string | null;
  usuarioBaixa?: string | null;
  camposPersonalizados?: RegisterCustomField[] | null;
}

export interface ListasDadosFatura {
  contasCorrenteAgencia: string[];
  bancos: string[];
  descricoes: string[];
  gruposReceita: string[];
  contasReceita: string[];
  filiaisCobranca: string[];
  centrosCusto: string[];
}
