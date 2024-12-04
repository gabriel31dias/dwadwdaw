export interface Movimento {
  tipoMovimento: string | null;
  contaCorrente: string | null;
  data: string;
  valor: string;
  observacao: string;
  usuario: string;
  codigoTipoMovimento?: string;
  codigoConta?: string;
  movimentaCaixa: boolean;
  dataInclusao?: string;
}
