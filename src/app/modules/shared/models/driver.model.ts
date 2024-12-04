export interface DriverAdvancedSearch {
  nome: string;
  rg: string;
  cpf: string;
  cnh_vencida: boolean;
  inativo?: boolean;
  bloqueado?: boolean;
}

export interface DriverGrid {
  // Id único para identificação do SlickGrid.
  id: number;
  // Dados do Motorista.
  codigo: string;
  cpf: string;
  rg: string;
  nome: string;
  apelido: string;
  tipo: string;
  status: string;
  celular: string;
  // Dados da CNH.
  registro: string;
  categoria: string;
  data_emissao: string;
  data_validade: string;
  // Endereço do Motorista.
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  // Campos para validações.
  cnh_vencida: boolean;
  inativo: boolean;
  bloqueado: boolean;
}

export class Driver {
  dados_motorista: DadosMotorista = new DadosMotorista();
  dados_cnh: DadosCNH = new DadosCNH();
  endereco_motorista: EnderecoMotorista = new EnderecoMotorista();
  filial: Filial = new Filial();
}

class DadosMotorista {
  codigo: string | null = null;
  cpf: string | null = null;
  rg: string | null = null;
  nome: string | null = null;
  apelido: string | null = null;
  tipo: string | null = null;
  status: string | null = null;
  celular: string | null = null;
  cnh_vencida?: boolean;
  inativo?: boolean;
  bloqueado?: boolean;
}

class DadosCNH {
  registro: string | null = null;
  categoria: string | null = null;
  data_emissao: string | null = null;
  data_validade: string | null = null;
}

class EnderecoMotorista {
  cep: string | null = null;
  endereco: string | null = null;
  numero: string | null = null;
  complemento: string | null = null;
  bairro: string | null = null;
  cidade: string | null = null;
  codigo_cidade: string | null = null;
  uf: string | null = null;
}

class Filial {
  codigo: string | null = null;
  cpf_cnpj: string | null = null;
  nome_fantasia: string | null = null;
}

