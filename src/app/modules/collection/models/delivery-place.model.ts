export interface LocalDeEntrega {
  dataEntrega: string | null;
  horaInicial: string | null;
  horaFinal: string | null;
  timeZone: number;

  cdCliente: string;
  cnpjCpf: string;
  empresa: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cdCidade: string;
  uf: string;
  responsavel: string;
  celular: string;
  email: string;
}
