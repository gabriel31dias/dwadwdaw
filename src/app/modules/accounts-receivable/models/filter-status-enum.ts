// Enum com exclusividade para o backend,
// pois o endpoint esta tratando o parâmetro como string e de forma diferente do que aparece na tela.
export enum FiltroStatusContasReceberBackend {
  'Em aberto',
  'Vencendo hoje',
  'Vencida',
  'Baixada',
}
