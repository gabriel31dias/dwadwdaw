import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DadosFatura } from 'src/app/modules/accounts-receivable/models/bill-include.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';

@Component({
  selector: 'app-bill-data',
  templateUrl: './bill-data.component.html',
  styleUrls: ['./bill-data.component.scss']
})
export class BillDataComponent {

  billData: any = <any>{};
  @Input() alertRequired: boolean = false;
  @Input() disableValueBill: boolean = false;
  @Input() disableEdit: boolean = false;
  companiesList: any[] = [];
  contasCorrenteAgencia: string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  filiaisPagadora: string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  bancos: string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  condicaoDePagamento: string [] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  gruposReceita:  string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  contasReceita: string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  centrosCusto: string[] = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5'];
  companyId: string;
  @Output() billDataEmitter: EventEmitter<DadosFatura> = new EventEmitter<DadosFatura>();
  timeout: any;
  loading: boolean = false;
  companies: any[] = [];

  constructor(private translate: TranslateService, private readonly storageService: StorageService,
  )
  {
    translate.use('pt-br')
    this.getCompanyList();
    this.companyId = storageService.getCompanyId()!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['billData']) {
      this.billDataEmitter.emit(this.billData);
    }
  }

  cnpjSelected(selected: any) {
    if (selected !== null) {
      if (selected == 0) {
        this.openModalSearchSupplier();
      } else {
        let item: any = this.companies.at(selected - 1);

        this.billData.cnpj = item.cpfCnpj + ' - ' + item.nomeFantasia;
        this.billData.nomeFantasia = item.nomeFantasia;
        this.billData.cdCliente = item.cdCliente;
        this.getConfigClient()
      }
    } else {
      this.clearConfigsClient();
    }
  }

  //Limpa as configurações
  clearConfigsClient() {
    this.billData.banco = null;
    this.billData.cdBanco = null;
    this.billData.contaCorrenteAgencia = null;
    this.billData.cdConta = null;
    this.billData.filialCobranca = null;
    this.billData.cdFilialCobranca = null;
    this.billData.descricao = null;
    this.billData.dataVencimento = null;
    this.billData.cdCondicaoPagamento = null;
    this.billData.grupoReceita = null;
    this.billData.cdGrupoReceita = null;
    this.billData.contaReceita = null;
    this.billData.cdContaReceita = null;
    this.billData.centroCustos = null;
    this.billData.cdCentroCustos = null;
  }

  //Traz as configurações dos clientes
  getConfigClient(){}

  openModalSearchSupplier(){}

  openEditSupplier(){}

  //Traz a lista das empresas
  getCompanyList(){
    this.companiesList = [
      'Teste 1',
      'Teste 2'
    ]
  }

  selectedOption(){}

  clearBankSelected(){}

  clearReceipt(){}

  // Busca a data e hora atual.
  getDateConditionPayment(days: number) {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + days)
    const day = dateNow.getDate().toString().padStart(2, '0');
    const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
    const year = dateNow.getFullYear();

    this.billData.dataVencimento = `${day}/${month}/${year}`;
  }

  // Funções para input de busca de CNPJ.
  search(text: string) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loading = true;
    // this.timeout = setTimeout(() => {
    //   this.collectionService.getClients(this.companyId, text).subscribe({
    //     next: (response) => {
    //       this.companies = response.dados;
    //       this.companiesList = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
    //       this.loading = false;
    //     },
    //     error: (response) => {
    //       this.loading = false;


    //     }
    //   });
    // }, 1000);
  }


}
