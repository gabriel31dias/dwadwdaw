import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { NovoCliente } from 'src/app/modules/shared/models/new-client.model';
import { ufs } from 'src/app/modules/shared/consts/uf.const';
import { AdressService } from 'src/app/modules/shared/services/adress.service';
import { ClientService } from '../../../services/client.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { removeMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { DateValidationsCollection } from 'src/app/modules/collection/models/date-validations-collection.model';

@Component({
  selector: 'app-modal-include-client',
  templateUrl: './modal-include-client.component.html',
  styleUrls: ['./modal-include-client.component.scss']
})
export class ModalIncludeClientComponent implements OnInit {

  private timeout: any;
  companyId: string;
  newClient: NovoCliente = <NovoCliente>{};
  ufs: string[];
  loading: boolean = false;
  mask: string = 'cpf';

  citiesName: string[] = [];
  infoCities: any[] = [];

  snackbar: Snackbar = new Snackbar();

  edit: boolean = false;
  alertRequired: boolean = false;

  cnpjSearch: string = '';
  cdClient: string = '';

  @Input() dateTimeValidations: DateValidationsCollection = <DateValidationsCollection>{};

  /** Construtor do componente 
   * @param translate Serviço de tradução para gerenciar a tradução do aplicativo.
   * @param modal Serviço para gerenciar o modal.
   * @param adressService Serviço para gerenciar operações relacionadas a endereços.
   * @param storageService Serviço para gerenciar armazenamento de dados.
   * @param clientService Serviço para gerenciar operações relacionadas a clientes.
   */
  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private readonly adressService: AdressService,
    private readonly storageService: StorageService,
    private clientService: ClientService
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;
    this.ufs = ufs;
  }

  /** Verifica se o componente está em modo de edição e, se estiver, chama o método 'searchClient' para buscar os dados do cliente. */
  ngOnInit(): void {
    if (this.edit) {
      this.searchClient();
    }
  }

  /**Define mascára de CPF e CNPJ conforme o comprimento do valor fornecido.
  * @param event Valor do evento disparado por um elemento de entrada.
  */
  setMask(event: any) {
    if (event.length > 11) {
      this.mask = 'cnpj'
    } else {
      this.mask = 'cpf'
    }
    this.newClient.cnpj = event;
  }

  /** Realiza a busca de informações detalhadas do cliente com base no código ou CPF/CNPJ. */
  searchClient() {
    this.loading = true;
    let keySearch: string = '';

    if (this.cdClient) {
      keySearch = this.cdClient;
    } else {
      keySearch = removeMaskCpfCnpj(this.cnpjSearch);
    }

    this.clientService.getDetailsClient(this.companyId, keySearch).subscribe({
      next: (response) => {
        this.newClient = response.dados;
        this.getCities('');
        this.loading = false;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.loading = false;
      }
    })
  }


  /** Limita o valor da inscrição estadual a um máximo de 20 caracteres e atualiza o estado do cliente.
   * @param newValue - O novo valor inserido pelo usuário no campo de entrada.*/
  maxCharacteresIE(newValue: string): void {
    if (newValue.length > 20) {
      this.newClient.inscricaoEstadual = newValue.slice(0, 20);
    } else {
      this.newClient.inscricaoEstadual = newValue;
    }
  }

  /** Fecha o modal aberto na interface do usuário. */
  close() {
    this.modal.close();
  }

  /** Verfica se todos os campos obrigatórios estão preenchidos e se o CPF/CNPJ tem o comprimento correto. */
  confirm() {
    if (this.verifyRequired()) {
      if (this.newClient.cnpj && (this.newClient.cnpj?.length === 14 || this.newClient.cnpj?.length === 11)) {
        if (this.newClient.endereco?.length <= 50) {
          if (!this.edit) {
            this.createClient();
          } else {
            this.editClient();
          }
        } else {
          this.snackbar.open = true;
          this.snackbar.message = 'Limite de caracter de endereço excedido.' + `(${this.newClient.endereco?.length} de 50)`;
        }
      } else {
        this.snackbar.open = true;
        this.snackbar.message = 'cnpjInvalido';
      }
    }
  }

  /** Cria um novo cliente e fecha o modal com as informações do cliente criado.*/
  createClient() {
    this.loading = true;
    this.clientService.createClient(this.companyId, this.newClient).subscribe({
      next: (response) => {
        this.loading = false;

        const client = {
          cnpj: this.newClient.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'),
          nomeFantasia: this.newClient.nome,
          cdCliente: this.newClient.cdCliente
        };

        this.modal.close(client);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  /** Envia uma requisição para atualizar os dados de um cliente existente. */
  editClient() {
    this.loading = true;
    this.clientService.updateClient(this.companyId, this.newClient).subscribe({
      next: (response) => {
        this.loading = false;

        const client = {
          cnpj: this.newClient.cnpj,
          nomeFantasia: this.newClient.nome,
          cdCliente: this.newClient.cdCliente
        };

        if (this.newClient.cnpj?.length === 11) client.cnpj = this.newClient.cnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        if (this.newClient.cnpj?.length === 14) client.cnpj = this.newClient.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

        this.modal.close(client);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  /** Busca informações de endereço a partir do CEP fornecido e atualiza os dados do cliente. */
  searchCep() {
    if (this.newClient.cep?.length !== 8) return;

    this.loading = true;
    this.adressService.getAdress(this.newClient.cep).subscribe({
      next: (response) => {
        this.newClient.endereco = response.logradouro;
        this.newClient.bairro = response.bairro;
        this.newClient.uf = response.uf;
        this.loading = false;
        this.searchCity(response.cidade, true)
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  /** Realiza a busca de cidades com um atraso de 2 segundos para evitar chamadas excessivas.
   * @param search Busca para filtrar as cidades.
   * @param select Opcional. Se verdadeiro, indica que a cidade encontrada deve ser selecionada.
   */
  searchCity(search: string, select?: boolean) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loading = true;
    this.timeout = setTimeout(() => {
      this.getCities(search, select)
    }, 2000)
  }

  /**  Função responsável por buscar cidades de acordo com o termo de pesquisa e estado (UF) selecionado.
   * @param search Termo de pesquisa para buscar cidades.
   * @param select Indica se a primeira cidade da lista deve ser selecionada automaticamente após a busca.
  */
  getCities(search: string, select?: boolean) {
    this.loading = true;
    const uf = this.newClient.uf ? this.newClient.uf : null;
    this.adressService.getCities(this.companyId, search, uf).subscribe({
      next: response => {
        this.citiesName = response.dados.map((city: any) => `${city.nome} - ${city.uf}`);
        this.infoCities = response.dados;
        this.loading = false;
        if (select) {
          this.selectCity(0);
        }
      },
      error: err => {
        this.loading = false;
      }
    });
  }

  /** Seleciona uma cidade da lista de cidades e atualiza os dados do cliente com as informações da cidade selecionada.
   * @param selected Índice da cidade selecionada na lista.
   * @returns  Atualiza as propriedades 'cidade', 'cdCidade' e 'UF' do cliente com base na cidade selecionada.
   */

  selectCity(selected: number | null) {
    if (selected !== null) {
      let item: any = this.infoCities.at(selected);
      if (this.newClient.cidade === item.nome &&
        this.newClient.cdCidade === item.cdCidade &&
        this.newClient.uf === item.uf
      ) {
        this.sameCity(item);
        return;
      }

      this.newClient.cidade = item.nome;
      this.newClient.cdCidade = item.cdCidade;
      this.newClient.uf = item.uf;
    } else {
      this.newClient.cidade = '';
      this.newClient.cdCidade = '';
      this.newClient.uf = '';
    }
  }

  /** Atualiza os dados de cidade do cliente com as informações fornecidas, com um pequeno atraso para garantir a atualização assíncrona.
   * @param newCity Nova cidade com informações como nome, código e unidade federativa.
   */
  sameCity(newCity: any) {
    this.newClient.cidade = ' ';

    setTimeout(() => {
      this.newClient.cidade = newCity.nome;
      this.newClient.cdCidade = newCity.cdCidade;
      this.newClient.uf = newCity.uf;
    }, 0);
  }

  /** Limpa os campos de cidade no objeto 'newClient' se o campo 'cidade' estiver definido. */
  clearFieldsCity() {
    if (this.newClient.cidade) {
      this.newClient.cidade = '';
      this.newClient.cdCidade = '';
      this.newClient.uf = '';
    }
  }

  /** Seleciona uma unidade federativa (UF) e atualiza os campos de cidade do cliente de acordo com ela.
   * @param selected Índice da UF selecionada na lista.
   */
  selectUF(selected: number | null) {
    if (selected !== null) {
      if (this.newClient.uf && this.newClient.uf !== ufs[selected]) {
        this.newClient.cidade = '';
        this.newClient.cdCidade = '';
      }

      this.newClient.uf = ufs[selected];
    } else {
      this.newClient.cidade = '';
      this.newClient.cdCidade = '';
      this.newClient.uf = '';
    }
    this.getCities('');
  }

  /** Obtém os dados do cliente com base no CNPJ fornecido e atualiza o objeto 'newClient' com as informações recebidas.
   * @param cnpj CNPJ do cliente para o qual os dados devem ser recuperados.
   */
  getDataByCNPJ(cnpj: string) {
    this.loading = true;
    this.clientService.getDataByCNPJ(cnpj).subscribe({
      next: (response) => {
        this.loading = false;
        const dataClientAPI = response.dados;

        this.newClient.nome = dataClientAPI.nome;
        this.newClient.cep = dataClientAPI.cep;
        this.newClient.endereco = dataClientAPI.logradouro;
        this.newClient.numero = dataClientAPI.numero;
        this.newClient.complemento = dataClientAPI.complemento;
        this.newClient.bairro = dataClientAPI.bairro;
        if (dataClientAPI.municipio) this.searchCity(dataClientAPI.municipio, true);
        this.newClient.uf = dataClientAPI.uf;
        this.newClient.responsavel = dataClientAPI.entidade_federativo_responsavel;
        this.newClient.celular = dataClientAPI.telefone;
        this.newClient.email = dataClientAPI.email;
      },
      error: (response) => {
        this.loading = false;
      }
    })
  }

  /** Verifica se todos os campos obrigatórios do objeto 'newClient' estão preenchidos.
   * @returns Retorna 'true' se todos os campos obrigatórios estiverem preenchidos; caso contrário, retorna 'false'.
   */
  verifyRequired(): boolean {
    if (
      this.newClient.cnpj &&
      this.newClient.nome &&
      this.newClient.cep &&
      this.newClient.endereco &&
      this.newClient.numero &&
      this.newClient.bairro &&
      this.newClient.uf &&
      this.newClient.cidade &&
      this.newClient.responsavel) {
      return true;
    } else {
      this.alertRequired = true;
      return false;
    }
  }
}
