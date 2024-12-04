/** Colunas padrões do GRID de Coleta */
export const defaultViewGridCollection: string[] = [
  'nColeta',
  'dataInclusao',
  'status',
  'coletadoEm',
  'cnpjSolicitante',
  'solicitante',
  'coletarEm',
  'cpfCnpjLocalColeta',
  'localColeta',
  'filialInclusao',
  'motorista',
  'placaVeiculo',
  'tipoVeiculo',
  'placaCarreta01',
  'cpfCnpjLocalEntrega',
  'localEntrega',
];

/** Colunas padrões do GRID do modal de busca avançada de Motorista. */
export const defaultViewGridAdvancedSearchDriver: string[] = [
  'cpf',
  'apelido',
  'tipo',
  'nome',
  'status',
  'categoria',
  'data_validade',
  'registro',
];

/** Colunas padrões do GRID do Grupo Modular de Seleção de Nota Fiscal (`gm-selection-nf`). */
export const defaultViewGridGMSelectionNF: string[] = [
  'numero',
  'serie',
  'pedido',
  'quantidade_volumes',
  'peso_liquido',
  'peso_bruto',
  'metragem_cubica',
  'valor_mercadoria',
];


/** Colunas padrões do GRID do modal de busca de nota fiscal */
export const defaultViewGridSearchNF: string[] = [
  'nome_fantasia_remetente',
  'nome_fantasia_destinatario',
  'numero',
  'serie',
  'data_emissao',
  'valor_mercadoria',
  'quantidade_volumes',
  'pedido',
];
// export const defaultViewGridSearchNF: string[] = [
//   'nota_fiscal',
//   'serie',
//   'data_emissao',
//   'pedido',
//   'remetente',
//   'destinatario',
//   'quantidade_volumes',
//   'valor_mercadoria'
// ];

