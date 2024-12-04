export class NotaFiscal {
  // Dados presentes em todos objetos.
  filial: DadosEmpresa = new DadosEmpresa();
  empresa: DadosEmpresa = new DadosEmpresa();
  nota: DadosNotaFiscal = new DadosNotaFiscal();
  remetente: Remetente = new Remetente();
  destinatario: Destinatario = new Destinatario();
  pagador: Pagador = new Pagador();
  // Dados presentes somente no GRID.
  expedidor?: Expedidor = new Expedidor();
  recebedor?: Recebedor = new Recebedor();
  transportador?: Transportador = new Transportador();
  outros_dados?: OutrosDados = new OutrosDados();
}

class DadosEmpresa {
  codigo: string | null = null;
  cpf_cnpj: string | null = null;
  nome_fantasia: string | null = null;
}

class PessoaEmpresa {
  cpf_cnpj: string | null = null;
  nome_fantasia: string | null = null;
}

class Remetente extends PessoaEmpresa { }
class Destinatario extends PessoaEmpresa { }
class Pagador extends PessoaEmpresa { }
class Expedidor extends PessoaEmpresa { }
class Recebedor extends PessoaEmpresa { }
class Transportador extends PessoaEmpresa { }

class DadosNotaFiscal {
  codigo: number | null = null;
  tipo_documento: string | null = null;
  numero: string | null = null;
  serie: string | null = null;
  data_emissao: string | null = null;
  chave_acesso: string | null = null;
  carga: Carga = new Carga();
}

class Carga {
  valor_mercadoria: number | null = null;
  metragem_cubica: number | null = null;
  peso_bruto: number | null = null;
  peso_liquido: number | null = null;
  quantidade_volumes: number | null = null;
  dados_adicionais: DadosAdicionais = new DadosAdicionais();
}

class DadosAdicionais {
  pedido: string | null = null;
  romaneio: string | null = null;
}

class OutrosDados {
  data_inclusao: string | null = null;
}

export class NotaFiscalGrid {
  // ID para identificação do SlickGrid.
  id: number | null = null;
  // Dados da Nota Fiscal.
  codigo: number | null = null;
  tipo_documento: string | null = null;
  numero: string | null = null;
  serie: string | null = null;
  data_emissao: string | null = null;
  chave_acesso: string | null = null;
  // Carga.
  valor_mercadoria: string | null = null;
  metragem_cubica: string | null = null;
  peso_bruto: string | null = null;
  peso_liquido: string | null = null;
  quantidade_volumes: number | null = null;
  // Dados adicionais da carga.
  pedido: string | null = null;
  romaneio: string | null = null;

  codigo_empresa: string | null = null;
  codigo_filial: string | null = null;
  cpf_cnpj_remetente: string | null = null;
  nome_fantasia_remetente: string | null = null;
  cpf_cnpj_destinatario: string | null = null;
  nome_fantasia_destinatario: string | null = null;
  cpf_cnpj_pagador: string | null = null;
  nome_fantasia_pagador: string | null = null;
  cpf_cnpj_transportador: string | null = null;
  nome_fantasia_transportador: string | null = null;
  cpf_cnpj_expedidor: string | null = null;
  nome_fantasia_expedidor: string | null = null;
  cpf_cnpj_recebedor: string | null = null;
  nome_fantasia_recebedor: string | null = null;
  data_inclusao: string | null = null;
}
