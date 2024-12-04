import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LocalDeEntrega } from '../../models/delivery-place.model';
import { ufs } from 'src/app/modules/shared/consts/uf.const';
import { ModalSearchClientComponent } from '../../../shared/components/modais/modal-search-client/modal-search-client.component';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { CollectionService } from '../../services/collection.service';
import { AdressService } from 'src/app/modules/shared/services/adress.service';
import { ModalIncludeClientComponent } from '../../../shared/components/modais/modal-include-client/modal-include-client.component';
import { removeMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { ClientService } from 'src/app/modules/shared/services/client.service';
import { NovoCliente } from 'src/app/modules/shared/models/new-client.model';
import { convertStringToDate, convertTimeToMinutes, getDateNow, initTimeIsBigger, isPastDate } from 'src/app/modules/shared/utils/period.utils';
import { DateValidationsCollection } from '../../models/date-validations-collection.model';
import { ActivatedRoute } from '@angular/router';
import { isYearBefore1900 } from 'src/app/modules/shared/utils/period.utils';
import { DadosColeta } from '../../models/info-collection.model';

@Component({
  selector: 'app-stage-delivery-place',
  templateUrl: './stage-delivery-place.component.html',
  styleUrls: ['./stage-delivery-place.component.scss']
})
export class StageDeliveryPlaceComponent implements OnChanges {

  private timeout: any;
  companyId: string;
  nCollection: string | null = null;
  loading: boolean = false;
  @Output() deliveryPlaceEmitter = new EventEmitter<LocalDeEntrega>()
  @Input() deliveryPlace: LocalDeEntrega = <LocalDeEntrega>{};
  @Input() collection: DadosColeta = <DadosColeta>{};
  ufs: string[];
  companies: any[] = [];
  companiesList: string[] = [];
  @Input() citiesList: { citiesName: string[], infoCities: any[] } = <{ citiesName: string[], infoCities: any[] }>{};
  @Output() citiesListEmitter = new EventEmitter<{ citiesName: string[], infoCities: any[] }>();
  @Input() alertRequired: boolean = false;
  @Input() readonly: boolean = false;
  dateNow: string = '';
  @Input() dateTimeValidations: DateValidationsCollection = <DateValidationsCollection>{};
  loadingCpfCnpjLocal: boolean = false;
  loadingCity: boolean = false;
  @Input() alertMessage: string = '';
  @Input() dateTimeValidationInfoAndDelivery: DateValidationsCollection = <DateValidationsCollection>{};
  @Input() messageDateError: string = "";
  @Input() messageHourInitError: string = "";
  @Input() messageHourEndError: string = "";
  @Output() dateChanged = new EventEmitter<any>();
  isDateChanged: boolean = false;




  /**Construtor do componente
   * @param translate  Serviço para gerenciar a tradução da aplicação.
   * @param modalService  Serviço do 'ng-bootstrap' para gerenciar modais
   * @param route  Serviço para acessar os parâmetros da rota ativa, permitindo acessar dados como parâmetros de consulta.
   * @param collectionService Serviço responsável por operações relacionadas à coleta de dados.
   * @param storageService Serviço para gerenciar armazenamento de dados.
   * @param adressService Serviço para gerenciar operações relacionadas a endereços, como buscar cidades.
   * @param clientService Serviço para operações relacionadas ao cliente, como gerenciar dados do cliente.
   */
  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private readonly collectionService: CollectionService,
    private readonly storageService: StorageService,
    private readonly adressService: AdressService,
    private clientService: ClientService,
    private cd: ChangeDetectorRef
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.nCollection = queryParams['number'];
      }
    })
    this.ufs = ufs;

    this.dateNow = getDateNow();
  }

  ngOnInit() {
    this.verifyDateTime();
  }
  /** Método do ciclo de vida do Angular que é chamado sempre que uma das propriedades de entrada do componente muda.
   * @param changes Um objeto que contém as mudanças das propriedades de entrada do componente. Cada propriedade é representada por uma instância de 'SimpleChange'.
    */
  ngOnChanges(changes: SimpleChanges): void {
    this.deliveryPlaceEmitter.emit(this.deliveryPlace);
    if (changes['deliveryPlace'] || changes['collection']) {
      this.verifyDateTime();
    }
    if (changes['deliveryPlace']?.isFirstChange()) {
      if ((!this.citiesList.citiesName || this.citiesList.citiesName.length == 0) && this.deliveryPlace.uf) this.getCities('');
    }

  }
  /**verifica se a data e hora de entrega são anteriores à data e hora de coleta. Se forem, retorna true, indicando uma condição inválida,caso contrário, retorna false
  * @param  dataColeta  data de coleta no formato `DD/MM/YYYY`.
  * @param  horaFinalColeta hora final de coleta no formato `HH:MM`.
  * @param  dataEntrega data de entrega no formato `DD/MM/YYYY`.
  * @param  horaFinalEntrega hora final de entrega no formato `HH:MM`.
  * @returns  Retorna `true` se a data e hora de entrega forem anteriores à data e hora de coleta; caso contrário, retorna `false`.
  */
  isDeliveryDateTimeBeforeCollection(
    dataColeta: string,
    horaFinalColeta: string,
    dataEntrega: string,
    horaFinalEntrega: string
  ): boolean {
    const dateColeta = convertStringToDate(dataColeta);
    const dateEntrega = convertStringToDate(dataEntrega);

    const finalColetaMinutos = convertTimeToMinutes(horaFinalColeta);
    const finalEntregaMinutos = convertTimeToMinutes(horaFinalEntrega);

    const hourEndCollection = new Date(dateColeta);
    hourEndCollection.setMinutes(finalColetaMinutos % 60);
    hourEndCollection.setHours(Math.floor(finalColetaMinutos / 60));

    const hourEndDelivery = new Date(dateEntrega);
    hourEndDelivery.setMinutes(finalEntregaMinutos % 60);
    hourEndDelivery.setHours(Math.floor(finalEntregaMinutos / 60));

    if (dateEntrega < dateColeta) {
      return true;
    }

    if (dateEntrega.getTime() === dateColeta.getTime()) {
      if (hourEndDelivery < hourEndCollection) {
        return true;
      }
    }
    return false;
  }

  /** Verifica se a data e hora de entrega são válidas em relação à data e hora de coleta.
   * @returns `true` se o período for válido (data e hora de entrega são após a coleta) e `false` se o período for inválido.
 */
  verifyPeriod(): boolean {
    if (this.collection.dataColeta && this.deliveryPlace.dataEntrega) {
      const horaFinalColeta = this.collection.horaFinal || '';
      const horaFinalEntrega = this.deliveryPlace.horaFinal || '';

      const isDateTimeInvalid = this.isDeliveryDateTimeBeforeCollection(
        this.collection.dataColeta,
        horaFinalColeta,
        this.deliveryPlace.dataEntrega,
        horaFinalEntrega
      );

      if (isDateTimeInvalid) {
        if (this.collection.dataColeta === this.deliveryPlace.dataEntrega) {
          const finalColetaMinutos = convertTimeToMinutes(horaFinalColeta);
          const finalEntregaMinutos = convertTimeToMinutes(horaFinalEntrega);

        if(finalColetaMinutos != null || finalColetaMinutos != ''){
          if (finalEntregaMinutos < finalColetaMinutos) {
            this.clearAll();
            this.dateTimeValidations.alertTimeFinal = true;
            this.dateTimeValidations.alertTimeFinalMessage = 'HoraEntregaAnteriorAColeta';
          }
          else { 
           this.clearValidationsTimeFinal();
          }
        } 
      }
        else {
          this.clearAll();
          this.dateTimeValidations.alertDate = true;
          this.dateTimeValidations.alertDateMessage = 'DataEntregaAnteriorAColeta';
        }
        return false;
      }
      this.clearValidationsDate();
      return true;
    } 
    return true;
  }

  verifyPassDate():boolean{
    if (this.deliveryPlace.dataEntrega) {
     if (isPastDate(this.deliveryPlace.dataEntrega)) {
      this.clearAll();
      this.dateTimeValidations.alertDate = true;
      this.dateTimeValidations.alertDateMessage = 'erroDataPassado';
      return true;
      }
     }
     return false;
  }

  verifyDate1900(): boolean {
    if (this.deliveryPlace.dataEntrega) {
      if (isYearBefore1900(this.deliveryPlace.dataEntrega)) {
        this.clearAll();
        this.dateTimeValidations.alertDate = true;
        this.dateTimeValidations.alertDateMessage = 'anoMenorQue1900';
        return true;
      }
    }
    this.clearValidationsDate();
    return false;
  }
  
 /** Limpa as verificações de data */
  clearValidationsDate(){
    this.dateTimeValidations.alertDate = false;
    this.dateTimeValidations.alertDateMessage = '';
  }

  /** Limpa as verificações de hora incial*/
  clearValidationsTimeInit() {
    this.dateTimeValidations.alertTimeInit = false;
    this.dateTimeValidations.alertTimeInitMessage = '';
  }

  /** Limpa as verificações de hora final*/
  clearValidationsTimeFinal() {
    this.dateTimeValidations.alertTimeFinal = false;
    this.dateTimeValidations.alertTimeFinalMessage = '';
  }

  /** Limpa todas as verificações */
  clearAll(){
    this.dateTimeValidations.alertDate = false;
    this.dateTimeValidations.alertDateMessage = '';
    this.dateTimeValidations.alertTimeFinal = false;
    this.dateTimeValidations.alertTimeFinalMessage = '';
    this.dateTimeValidations.alertTimeInit = false;
    this.dateTimeValidations.alertTimeInitMessage = '';
  }
  
  /**  Verifica se o horário inicial (`horaInicial`) é maior que o horário final (`horaFinal`) no objeto `deliveryPlace`. */
  verifyTimeInit() {
    if (this.deliveryPlace.horaFinal && this.deliveryPlace.horaInicial && initTimeIsBigger(this.deliveryPlace.horaInicial, this.deliveryPlace.horaFinal ) && !this.dateTimeValidations.alertDate) {
      this.clearAll();
      this.dateTimeValidations.alertTimeInit = true;
      this.dateTimeValidations.alertTimeInitMessage = 'erroHoraInicialMaiorQueFinal';
      return true;
    } else {
      this.clearAll();
      return false;
    }
  }
  /** Verifica se o horário final (`horaFinal`) é uma hora no passado em relação à data de entrega (`dataEntrega`). */
  verifyTimeFinal() {
    if (this.deliveryPlace.horaFinal && this.deliveryPlace.dataEntrega && isPastDate(this.deliveryPlace.dataEntrega, this.deliveryPlace.horaFinal)&& !this.dateTimeValidations.alertDate) {
      this.clearAll();
      this.dateTimeValidations.alertTimeFinal = true;
      this.dateTimeValidations.alertTimeFinalMessage = 'erroHoraPassado';
      return true;
    } else {
      this.clearAll();
      return false;
    }
  }

  /** Verifica a validade da data e hora com base na condição de coleta.*/
  verifyDateTime() {
    if(!this.verifyPeriod())return;
    if(this.verifyDate1900())return;
    if(this.verifyTimeInit()) return;
    if(!this.nCollection){
      if(this.verifyPassDate()) return;
      if(this.verifyTimeFinal()) return;
    }
  }


  /** Função chamada sempre que a data de entrega é alterada no componente data.
   * @param newDate Valor atualizado da data de entrega.
   */
  onDateChanged(newDate: any) {
    this.verifyDateTime();
    this.dateChanged.emit(newDate);
  }


  /** Verifica se existe alguma mensagem de validação nos alertas de data ou horário.
   * @returns Retorna `true` se houver qualquer mensagem de validação; caso contrário, retorna `false`.
   */
  hasMessageValidation(): boolean {
    if (this.dateTimeValidations.alertDateMessage ||
      this.dateTimeValidations.alertTimeInitMessage ||
      this.dateTimeValidations.alertTimeFinalMessage) {
      return true;
    }

    return false;
  }


  /** Manipula a seleção de um CNPJ ou CPF no dropdown.
   * @param selected O valor selecionado no dropdown.
   */
  cnpjSelected(selected: any) {
    if (selected !== null) {
      if (selected == 0) {
        this.openModalSearchClient();
      } else {
        let item: any = this.companies.at(selected - 1);
        this.deliveryPlace.cnpjCpf = item.cpfCnpj + ' - ' + item.nomeFantasia;
        this.deliveryPlace.empresa = item.nomeFantasia;
        this.deliveryPlace.cdCliente = item.cdCliente;
        this.getAddressClient();
      }
    }
  }

  /** Obtém o endereço do cliente com base no código do cliente (`cdCliente`) ou no CNPJ/CPF. */
  getAddressClient() {
    let keySearch: string = '';
    if (this.deliveryPlace.cdCliente) {
      keySearch = this.deliveryPlace.cdCliente;
    } else {
      const cnpjWithMask = this.deliveryPlace.cnpjCpf?.split(' - ')[0];
      keySearch = removeMaskCpfCnpj(cnpjWithMask)
    }

    this.clientService.getDetailsClient(this.companyId, keySearch).subscribe({
      next: (response) => {
        let client: NovoCliente = <NovoCliente>{};
        client = response.dados;

        this.deliveryPlace.cep = client.cep;
        this.deliveryPlace.endereco = client.endereco;
        this.deliveryPlace.numero = client.numero;
        this.deliveryPlace.complemento = client.complemento;
        this.deliveryPlace.bairro = client.bairro;
        this.deliveryPlace.cdCidade = client.cdCidade;
        this.deliveryPlace.cidade = client.cidade;
        this.getCities(this.deliveryPlace.cidade);
        this.deliveryPlace.uf = client.uf;
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
      }
    })
  }

  /** Abre um modal para editar as informações do cliente. */
  openEditClient() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalIncludeClientComponent, modalOptions);
    modalRef.componentInstance.edit = true;
    modalRef.componentInstance.cdClient = this.deliveryPlace.cdCliente;
    [modalRef.componentInstance.cnpjSearch,] = this.deliveryPlace.cnpjCpf?.split(' - ');

    modalRef.result
      .then((res: any) => {
        if (res) {
          const clientEdited = res;
          this.deliveryPlace.cnpjCpf = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
          this.deliveryPlace.empresa = clientEdited.nomeFantasia;
          this.deliveryPlace.cdCliente = clientEdited.cdCliente;
        }
      })
      .catch((res) => {

      })
  }

  /** Abre um modal para pesquisar o cliente. */
  openModalSearchClient() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalSearchClientComponent, modalOptions);

    modalRef.result
      .then((res: any) => {
        if (res) {
          this.deliveryPlace.cnpjCpf = res.cnpj + ' - ' + res.nomeFantasia;
          this.deliveryPlace.empresa = res.nomeFantasia;
          this.deliveryPlace.cdCliente = res.cdCliente;
          this.getAddressClient();
        }
      })
      .catch((res) => {

      })
  }

  /** Realiza a pesquisa de clientes com base no texto inserido e no tipo de busca.
   * @param text O texto a ser pesquisado.
   * @param type O tipo de busca (1 para busca local de CPF/CNPJ, outro valor para busca geral).
   */
  search(text: string, type: number) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (type == 1) {
      this.loadingCpfCnpjLocal = true;
    } else {
      this.loading = true
    }

    this.timeout = setTimeout(() => {
      this.collectionService.getClients(this.companyId, text).subscribe({
        next: response => {
          this.companies = response.dados
          this.companiesList = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);

          if (type == 1) {
            this.loadingCpfCnpjLocal = false;
          } else {
            this.loading = false;
          }
        },
        error: err => {
          if (type == 1) {
            this.loadingCpfCnpjLocal = false;
          } else {
            this.loading = false;
          }
        }
      });
    }, 1000);
  }

  /** Realiza a busca de endereço com base no CEP fornecido. */
  searchCep() {
    if (this.deliveryPlace.cep.length !== 8) return;

    this.loading = true;
    this.adressService.getAdress(this.deliveryPlace.cep).subscribe({
      next: response => {
        this.deliveryPlace.endereco = response.logradouro;
        this.deliveryPlace.bairro = response.bairro;
        this.deliveryPlace.uf = response.uf;
        this.loading = false;
        this.searchCity(response.cidade, true)
      },
      error: err => {
        this.loading = false;
      }
    });
  }

  /** Realiza a busca de cidades com base no texto de pesquisa fornecido.
   * @param search  O texto para pesquisar cidades.
   * @param select Um parâmetro opcional para selecionar a primeira cidade retornada.
   */
  searchCity(search: string, select?: boolean) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loadingCity = true;
    this.timeout = setTimeout(() => {
      this.getCities(search, select)
      this.loadingCity = false;
    }, 2000)
  }

  /** Realiza a busca de cidades com base no texto de pesquisa e na unidade federativa (UF) fornecida.
   * @param search O texto para pesquisar cidades.
   * @param select  Um parâmetro opcional para selecionar a primeira cidade retornada.
   */
  getCities(search: string, select?: boolean) {
    this.loading = true;
    const uf = this.deliveryPlace.uf ? this.deliveryPlace.uf : null;
    this.adressService.getCities(this.companyId, search, uf).subscribe({
      next: response => {
        this.citiesList.citiesName = response.dados.map((city: any) => `${city.nome} - ${city.uf}`);
        this.citiesList.infoCities = response.dados;
        this.citiesListEmitter.emit({ citiesName: this.citiesList.citiesName, infoCities: this.citiesList.infoCities });
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

  /** Seleciona uma cidade da lista com base no índice fornecido e atualiza o objeto `deliveryPlace` com as informações
   * @param selected O índice da cidade selecionada na lista ou `null` para limpar a seleção.
   */
  selectCity(selected: number | null) {
    if (selected !== null) {
      let item: any = this.citiesList.infoCities.at(selected);
      if (this.deliveryPlace.cidade === item.nome &&
        this.deliveryPlace.cdCidade === item.cdCidade &&
        this.deliveryPlace.uf === item.uf
      ) {
        this.sameCity(item);
        return;
      }

      this.deliveryPlace.cidade = item.nome;
      this.deliveryPlace.cdCidade = item.cdCidade;
      this.deliveryPlace.uf = item.uf;
    } else {
      this.deliveryPlace.cidade = '';
      this.deliveryPlace.cdCidade = '';
      this.deliveryPlace.uf = '';
    }
  }

  /** Atualiza o objeto `deliveryPlace` com as informações da cidade fornecida após um timeout.
   * @param newCity As novas informações da cidade para atualizar no `deliveryPlace`.
   */
  sameCity(newCity: any) {
    this.deliveryPlace.cidade = ' ';

    setTimeout(() => {
      this.deliveryPlace.cidade = newCity.nome;
      this.deliveryPlace.cdCidade = newCity.cdCidade;
      this.deliveryPlace.uf = newCity.uf;
    }, 0);
  }

  /** Limpa os campos relacionados à cidade no objeto `deliveryPlace`. */
  clearFieldsCity() {
    if (this.deliveryPlace.cidade) {
      this.deliveryPlace.cidade = '';
      this.deliveryPlace.cdCidade = '';
      this.deliveryPlace.uf = '';
    }
  }

  /** Atualiza a unidade federativa (UF) no objeto `deliveryPlace` com base no índice selecionado
   * @param selected O índice da UF selecionada na lista ou `null` para limpar a seleção.
   */
  selectUF(selected: number | null) {
    if (selected !== null) {
      if (this.deliveryPlace.uf && this.deliveryPlace.uf !== ufs[selected]) {
        this.deliveryPlace.cidade = '';
        this.deliveryPlace.cdCidade = '';
      }

      this.deliveryPlace.uf = ufs[selected];
    } else {
      this.deliveryPlace.cidade = '';
      this.deliveryPlace.cdCidade = '';
      this.deliveryPlace.uf = '';
    }
    this.getCities('');
  }

}
