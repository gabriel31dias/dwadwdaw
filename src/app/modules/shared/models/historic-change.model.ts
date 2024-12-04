export interface Historico {
  id: string;
  acao: string;
  usuario: string;
  data: string;
  hora: string;
  quantidadeDeAlteracoes: number;
  detalhes: DetalhesHistorico[];
}

export interface DetalhesHistorico {
  id: number;
  campo: string;
  idHistoricoAlteracao: number;
  valorAnterior: string;
  valorAtual: string;
}
