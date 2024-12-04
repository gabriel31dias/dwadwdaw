import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ModalSearchClientComponent } from '../../../shared/components/modais/modal-search-client/modal-search-client.component';
import { TypesCollection } from '../../models/types-collection.enum';
import { CollectionService } from '../../services/collection.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { AdressService } from 'src/app/modules/shared/services/adress.service';
import { DadosColeta } from '../../models/info-collection.model';
import { ufs } from 'src/app/modules/shared/consts/uf.const';
import { ModalIncludeClientComponent } from '../../../shared/components/modais/modal-include-client/modal-include-client.component';
import { ClientService } from 'src/app/modules/shared/services/client.service';
import { removeMaskCpfCnpj, setMaskCnpj, setMaskCpf } from 'src/app/modules/shared/utils/cnpj-mask';
import { NovoCliente } from 'src/app/modules/shared/models/new-client.model';
import { TypesService } from '../../models/type-service-collection.model';
import { CompanyService } from 'src/app/modules/shared/services/company.service';
import { getDateNow, initTimeIsBigger, isPastDate } from 'src/app/modules/shared/utils/period.utils';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { DateValidationsCollection } from '../../models/date-validations-collection.model';
import { ActivatedRoute } from '@angular/router';
import { isYearBefore1900 } from 'src/app/modules/shared/utils/period.utils';
import { LocalDeEntrega } from '../../models/delivery-place.model';

@Component({
  selector: 'app-stage-info-collection',
  templateUrl: './stage-info-collection.component.html',
  styleUrls: ['./stage-info-collection.component.scss']
})
export class StageInfoCollectionComponent implements OnChanges {

  private timeout: any;
  mesmoEnderecoSolicitanteTraduzido: string;
  companyId: string;
  nCollection: string | null = null;
  loading: boolean = false;
  sameAdress: boolean = false;
  companies = [];
  companiesList = [];
  companiesList2 = [];
  ufs: string[];
  typesCollection: string[] = [TypesCollection[0], TypesCollection[1]];
  @Input() typeCollectionSelected: number | null = null;
  @Input() readonly: boolean = false;
  @Output() typeCollectionEmitter = new EventEmitter<number | null>();
  @Input() citiesList: { citiesName: string[], infoCities: any[] } = <{ citiesName: string[], infoCities: any[] }>{};
  @Output() citiesListEmitter = new EventEmitter<{ citiesName: string[], infoCities: any[] }>();
  @Input() subsidiariesName: string[] = [];
  @Input() infoSubsidiaries: any[] = [];
  @Input() collection: DadosColeta = <DadosColeta>{};  
  @Input() deliveryPlace: LocalDeEntrega = <LocalDeEntrega>{};
  @Input() typesServices: TypesService[] = [];
  @Output() infoCollectionEmitter = new EventEmitter<DadosColeta>();
  @Input() alertRequired: boolean = false;
  snackbar: Snackbar = new Snackbar();
  dateNow: string = '';
  @Input() dateTimeValidations: DateValidationsCollection = <DateValidationsCollection>{};
  loadingCpfCnpjSolicitante: boolean = false;
  loadingCpfCnpjLocal: boolean = false;
  loadingCity: boolean = false;
  @Input() messageDateError: string = "";
  @Input() messageHourInitError: string = "";
  @Input() messageHourEndError: string = "";


  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private readonly collectionService: CollectionService,
    private readonly storageService: StorageService,
    private readonly adressService: AdressService,
    private clientService: ClientService,
    private companyService: CompanyService
  ) {
    this.mesmoEnderecoSolicitanteTraduzido = this.translate.instant('mesmoEnderecoSolicitante');

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


  ngOnChanges(changes: SimpleChanges): void {
    this.infoCollectionEmitter.emit(this.collection);

    if (this.collection.cnpjCpfColeta &&
      this.collection.cnpjCpfSolicitante &&
      this.collection.cnpjCpfColeta === this.collection.cnpjCpfSolicitante
    ) {
      this.sameAdress = true;
    }

    if (changes['collection']?.isFirstChange()) {
      if ((!this.citiesList.citiesName || this.citiesList.citiesName.length == 0) && this.collection.uf) this.getCities('');
    }
  }

  sameAdressChecked(checked: boolean) {
    if (checked) {
      this.collection.cnpjCpfColeta = this.collection.cnpjCpfSolicitante;
      this.collection.nomeFantasiaColeta = this.collection.nomeFantasiaSolicitante;
      this.collection.cdClienteColeta = this.collection.cdClienteSolicitante;
      this.getAddressClient();
    } else {
      this.collection.cnpjCpfColeta = '';
      this.collection.nomeFantasiaColeta = '';
      this.collection.cdClienteColeta = '';
      this.collection.cep = '';
      this.collection.endereco = '';
      this.collection.numero = '';
      this.collection.complemento = '';
      this.collection.bairro = '';
      this.collection.cdCidade = '';
      this.collection.cidade = '';
      this.collection.uf = '';
      this.collection.responsavel = ''
      this.collection.celular = ''
      this.collection.email = ''


    }
  }

  cnpjSelected(selected: any, type: number) {
    if (selected !== null) {
      if (selected == 0) {
        this.openModalSearchClient(type);
      } else {
        let item: any = this.companies.at(selected - 1);
        let item2: any = this.companies.at(selected - 1);
        if (type == 1) {
          this.collection.cnpjCpfSolicitante = item.cpfCnpj + ' - ' + item.nomeFantasia;
          this.collection.nomeFantasiaSolicitante = item.nomeFantasia;
          this.collection.cdClienteSolicitante = item.cdCliente;

          if (this.sameAdress) {
            this.collection.cnpjCpfColeta = this.collection.cnpjCpfSolicitante;
            this.collection.nomeFantasiaColeta = this.collection.nomeFantasiaSolicitante;
            this.collection.cdClienteColeta = this.collection.cdClienteSolicitante;
            this.getAddressClient();
          }
        } else {
          this.collection.cnpjCpfColeta = item2.cpfCnpj + ' - ' + item2.nomeFantasia;
          this.collection.nomeFantasiaColeta = item2.nomeFantasia;
          this.collection.cdClienteColeta = item2.cdCliente;
          this.getAddressClient();
        }
      }
    }
  }

  getAddressClient() {
    let keySearch: string = '';
    if (this.collection.cdClienteColeta) {
      keySearch = this.collection.cdClienteColeta;
    } else {
      const cnpjWithMask = this.collection.cnpjCpfColeta?.split(' - ')[0];
      keySearch = removeMaskCpfCnpj(cnpjWithMask)
    }

    this.clientService.getDetailsClient(this.companyId, keySearch).subscribe({
      next: (response) => {
        let client: NovoCliente = <NovoCliente>{};
        client = response.dados;


        this.collection.cep = client.cep;
        this.collection.endereco = client.endereco;
        this.collection.numero = client.numero;
        this.collection.complemento = client.complemento;
        this.collection.bairro = client.bairro;
        this.collection.cdCidade = client.cdCidade;
        this.collection.cidade = client.cidade;
        this.collection.uf = client.uf;
        this.collection.responsavel = client.responsavel
        this.collection.celular = client.celular
        this.collection.email = client.email



        this.getCities(this.collection.cidade);
        this.getSubsidiaryByCidade(this.collection.cdCidade);
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
      }
    })
  }

  openEditClient(type: 1 | 2) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalIncludeClientComponent, modalOptions);
    modalRef.componentInstance.edit = true;
    if (type === 1) {
      modalRef.componentInstance.cdClient = this.collection.cdClienteSolicitante;
      [modalRef.componentInstance.cnpjSearch,] = this.collection.cnpjCpfSolicitante?.split(' - ');
    }

    if (type === 2) {
      modalRef.componentInstance.cdClient = this.collection.cdClienteColeta;
      [modalRef.componentInstance.cnpjSearch,] = this.collection.cnpjCpfColeta?.split(' - ');
    }


    modalRef.result
      .then((res: any) => {
        if (res) {
          const clientEdited = res;
          if (type === 1) {
            this.collection.cnpjCpfSolicitante = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
            this.collection.nomeFantasiaSolicitante = clientEdited.nomeFantasia;
            this.collection.cdClienteSolicitante = clientEdited.cdCliente;
          }

          if (type === 2) {
            this.collection.cnpjCpfColeta = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
            this.collection.nomeFantasiaColeta = clientEdited.nomeFantasia;
            this.collection.cdClienteColeta = clientEdited.cdCliente;
          }

          this.getAddressClient()
        }
      })
      .catch((res) => {

      })
  }

  search(text: string, type: number) {

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (type == 1) {
      this.loadingCpfCnpjSolicitante = true;
    }
    else if (type == 2) {
      this.loadingCpfCnpjLocal = true;
    } else {
      this.loading = true;
    }
    this.timeout = setTimeout(() => {
      this.collectionService.getClients(this.companyId, text).subscribe(
        {
          next: response => {
            this.companies = response.dados
            if (type == 1) {
              this.companiesList = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
            } else {
              this.companiesList2 = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
            }

            if (type == 1) {
              this.loadingCpfCnpjSolicitante = false;
            }
            else if (type == 2) {
              this.loadingCpfCnpjLocal = false;
            } else {
              this.loading = false;
            }

          },
          error: err => {
            if (type == 1) {
              this.loadingCpfCnpjSolicitante = false;
            }
            else if (type == 2) {
              this.loadingCpfCnpjLocal = false;
            } else {
              this.loading = false;
            }
          }
        }
      );
    }, 1000);
  }

  openModalSearchClient(type: number) {
    this.collection.cnpjCpfSolicitante = '';
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalSearchClientComponent, modalOptions);

    modalRef.result
      .then((res: any) => {
        if (res) {
          if (type === 1) {
            this.collection.cnpjCpfSolicitante = (res.cnpj.length > 11 ? setMaskCnpj(res.cnpj) : setMaskCpf(res.cnpj)) + ' - ' + res.nomeFantasia;
            this.collection.nomeFantasiaSolicitante = res.nomeFantasia;
            this.collection.cdClienteSolicitante = res.cdCliente;

            if (this.sameAdress) {
              this.collection.cnpjCpfColeta = this.collection.cnpjCpfSolicitante;
              this.collection.nomeFantasiaColeta = this.collection.nomeFantasiaSolicitante;
              this.collection.cdClienteColeta = this.collection.cdClienteSolicitante;
              this.getAddressClient();
            }
          } else {
            this.collection.cnpjCpfColeta = res.cnpj + ' - ' + res.nomeFantasia;
            this.collection.nomeFantasiaColeta = res.nomeFantasia;
            this.collection.cdClienteColeta = res.cdCliente;
            this.getAddressClient();
          }
        }
      })
      .catch((res) => {

      })
  }

  searchCep() {
    if (this.collection.cep.length !== 8) return;

    this.loading = true;
    this.adressService.getAdress(this.collection.cep).subscribe({
      next: response => {
        this.collection.endereco = response.logradouro;
        this.collection.bairro = response.bairro;
        this.collection.uf = response.uf;
        this.loading = false;
        this.searchCity(response.cidade, true)
      },
      error: err => {
        this.loading = false;
      }
    });
  }

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

  getCities(search: string, select?: boolean) {
    this.loadingCity = true;
    const uf = this.collection.uf ? this.collection.uf : null;
    this.adressService.getCities(this.companyId, search, uf).subscribe({
      next: response => {
        this.citiesList.citiesName = response.dados.map((city: any) => `${city.nome} - ${city.uf}`);
        this.citiesList.infoCities = response.dados;
        this.citiesListEmitter.emit({ citiesName: this.citiesList.citiesName, infoCities: this.citiesList.infoCities });
        this.loadingCity = false;
        if (select) {
          this.selectCity(0);
        }
      },
      error: err => {
        this.loadingCity = false;
      }
    });
  }

  selectCity(selected: number | null) {
    if (selected !== null) {
      let item: any = this.citiesList.infoCities.at(selected);
      if (this.collection.cidade === item.nome &&
        this.collection.cdCidade === item.cdCidade &&
        this.collection.uf === item.uf
      ) {
        this.sameCity(item);
        return;
      }

      this.collection.cidade = item.nome;
      this.collection.cdCidade = item.cdCidade;
      this.collection.uf = item.uf;
      this.getSubsidiaryByCidade(this.collection.cdCidade);
    } else {
      this.collection.cidade = '';
      this.collection.cdCidade = '';
      this.collection.uf = null;
    }
  }

  sameCity(newCity: any) {
    this.collection.cidade = ' ';

    setTimeout(() => {
      this.collection.cidade = newCity.nome;
      this.collection.cdCidade = newCity.cdCidade;
      this.collection.uf = newCity.uf;
      this.getSubsidiaryByCidade(this.collection.cdCidade);
    }, 0);
  }

  clearFieldsCity() {
    if (this.collection.cidade) {
      this.collection.cidade = '';
      this.collection.cdCidade = '';
      this.collection.uf = null;
    }
  }

  selectUF(selected: number | null) {
    if (selected !== null) {
      if (this.collection.uf && this.collection.uf !== ufs[selected]) {
        this.collection.cidade = '';
        this.collection.cdCidade = '';
      }

      this.collection.uf = ufs[selected];
    } else {
      this.collection.cidade = '';
      this.collection.cdCidade = '';
      this.collection.uf = null;
    }
    this.getCities('');
  }

  getSubsidiaryByCidade(cdCity: string) {
    this.loading = true;
    this.companyService.getSubsidiaryByCity(this.companyId, cdCity).subscribe({
      next: (response) => {
        const filial = response.dados;
        if (filial === null) {
          this.setSubsidiaryStorage();
        } else {
          this.collection.filialResponsavel = filial.nome;
          this.collection.cdFilialResponsavel = filial.cdFilial;
        }
        this.loading = false;
      },
      error: (response) => {
        this.setSubsidiaryStorage();
        this.loading = false;
      }
    })
  }

  setSubsidiaryStorage() {
    const cdFilial = this.storageService.getSubsidiaryId();

    if (cdFilial) {
      this.collection.filialResponsavel = this.storageService.getCompanyName()!;
      this.collection.cdFilialResponsavel = cdFilial;
    }
  }

  selectSubsidiary(selected: number | null) {
    if (selected !== null) {
      let item: any = this.infoSubsidiaries.at(selected);
      this.collection.filialResponsavel = item.nome;
      this.collection.cdFilialResponsavel = item.cdFilial;
    } else {
      this.collection.filialResponsavel = '';
      this.collection.cdFilialResponsavel = '';
    }
  }

  getListTypesService(): string[] {
    if (this.typesServices.length === 0) return [];

    const typesList: string[] = [];
    for (const type of this.typesServices) {
      typesList.push(type.nomeServico);
    }
    return typesList;
  }

  getTypeServiceSelected(): string | null {
    if (this.collection.tipoServico === null) return null;

    const type: TypesService | undefined = this.typesServices.find(
      type => type.idServico === this.collection.tipoServico
    )

    return type ? type.nomeServico : null;
  }

  verifyPassDate():boolean{
    if (this.collection.dataColeta) {
     if (isPastDate(this.collection.dataColeta)) {
      this.clearValidationDateTime(); 
      this.dateTimeValidations.alertDate = true;
      this.dateTimeValidations.alertDateMessage = 'erroDataPassado';
      return true;
      }
     }
     this.clearValidationDateTime();
     return false;
  }

  verifyDate1900(): boolean {
    if (this.collection.dataColeta) {
      if (isYearBefore1900(this.collection.dataColeta)) {
        this.clearValidationDateTime(); 
        this.dateTimeValidations.alertDate = true;
        this.dateTimeValidations.alertDateMessage = 'anoMenorQue1900';
        return true;
      }
    }
    this.clearValidationDateTime();
    return false;
  }
  
  verifyTimeInit() {
    if (this.collection.horaFinal && this.collection.horaInicial && initTimeIsBigger(this.collection.horaInicial, this.collection.horaFinal)) {
      this.clearValidationDateTime();
      this.dateTimeValidations.alertTimeInit = true;
      this.dateTimeValidations.alertTimeInitMessage = 'erroHoraInicialMaiorQueFinal';
      return true;
    } else {
      return false;
    }
  }

  verifyTimeFinal() {
    if (this.collection.horaFinal && this.collection.dataColeta && isPastDate(this.collection.dataColeta, this.collection.horaFinal)) {
      this.clearValidationDateTime();
      this.dateTimeValidations.alertTimeFinal = true;
      this.dateTimeValidations.alertTimeFinalMessage = 'erroHoraPassado';
      return true;
    } else {
      return false;
    }
  }

  clearValidationDateTime(){
    this.messageDateError = '';
    this.dateTimeValidations.alertTimeFinal = false;
    this.dateTimeValidations.alertTimeFinalMessage = '';
    this.dateTimeValidations.alertTimeInit = false;
    this.dateTimeValidations.alertTimeInitMessage = '';
    this.dateTimeValidations.alertDate = false;
    this.dateTimeValidations.alertDateMessage = '';
  }

  /** Verfica a validade de datas e horários. 
   * @returns Esta função não retorna valores diretamente, apenas atualiza os estados de validação (`alertDate` e `alertDateMessage`).
  */
  verifyDateTime() {
    if(this.verifyDate1900()) return;
    if(this.verifyTimeInit()) return;
    if(!this.nCollection){
      if(this.verifyPassDate()) return;
      if(this.verifyTimeFinal()) return;
    }
 }
}