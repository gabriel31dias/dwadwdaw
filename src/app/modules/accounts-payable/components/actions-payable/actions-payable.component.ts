import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ListasDadosFatura } from 'src/app/modules/accounts-receivable/models/bill-include.model';
import { DadosBoletoFatura } from 'src/app/modules/accounts-receivable/models/billet-data.model';
import { CreateAccountReceivable, FreightDocument } from 'src/app/modules/accounts-receivable/models/create-account-receivable.model';
import { IndexListsBillData } from 'src/app/modules/accounts-receivable/models/index-lists-selected.model';
import { Movimento } from 'src/app/modules/accounts-receivable/models/movement.model';
import { ReceivableService } from 'src/app/modules/accounts-receivable/services/receivable.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { TypeCustomField, typeWithItems } from 'src/app/modules/settings/models/type-custom-field';
import { CustomFieldService } from 'src/app/modules/settings/services/custom-field.service';
import { ExhibitionCustomField, RegisterCustomField } from 'src/app/modules/shared/models/exhibition-custom-field.model';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StepperModel } from 'src/app/modules/shared/models/stepper.model';
import { removeMaskCpfCnpj, setMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { formatDateBack, formatDateTimeString, formatDateUtcToBr, formatOnlyDateBack } from 'src/app/modules/shared/utils/date-utils';

@Component({
  selector: 'app-actions-payable',
  templateUrl: './actions-payable.component.html',
  styleUrls: ['./actions-payable.component.scss']
})
export class ActionsPayableComponent {

  companyId: string;
  disableEdit: boolean = false;
  idBill: string = '';
  steppers: StepperModel[] = [];
  stepperIndex: number = 0;
  billData: any = <any>{};
  ableMovements: boolean = true;
  stepName: string = '';
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  dropdownsBack: any;
  lists: ListasDadosFatura = <ListasDadosFatura>{};
  @Input() clientNameFilter: string = '';
  alertRequired: boolean = false;
  objCreateReceivable: CreateAccountReceivable = <CreateAccountReceivable>{};
  indexSelecteds: IndexListsBillData = <IndexListsBillData>{};
  ctes: any[] = [];
  accountsReceiptBack: any;
  stageBillet: boolean = false;
  showCustomField: boolean = false;
  movements: Movimento[] = [];
  customField: ExhibitionCustomField[] = [];
  registerCustomField: RegisterCustomField[] = [];
  disableValueBill: boolean = false;
  billetData: DadosBoletoFatura = <DadosBoletoFatura>{};
  banksList: any[] = [];
  customFieldData: boolean = false;

  constructor(private router: Router, private storageService: StorageService,
    private receivableService: ReceivableService, private customFieldService: CustomFieldService
  )
  {

    this.companyId = storageService.getCompanyId()!;
    this.setStepper();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientNameFilter']) {
      this.clientNameFilter = changes['clientNameFilter'].currentValue;
    }
  }

  openModalDetailsReceivable(){}

  // Busca a data e hora atual.
  getDateTime() {
    const dateNow = new Date();

    const day = dateNow.getDate().toString().padStart(2, '0');
    const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
    const year = dateNow.getFullYear();
    const hours = dateNow.getHours().toString().padStart(2, '0');
    const minutes = dateNow.getMinutes().toString().padStart(2, '0');
    const seconds = dateNow.getSeconds().toString().padStart(2, '0');

    this.billData.dataEmissao = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }

  // Verifica se o usuário preencheu todos os campos obrigatórios.
  verifyRequired(): boolean {
    if (this.billData.dataEmissao &&
      this.billData.cnpj &&
      this.billData.contaCorrenteAgencia &&
      this.billData.dataVencimento
    ) {
      if (this.billData.valorFatura || this.billData.length >= 1) {
        return true;
      } else {
        this.alertRequired = true;
        this.snackbar.open = true;
        this.snackbar.message = 'insiraUmValorOuCTeParaConcluir';
        return false;
      }
    } else {
      this.alertRequired = true;
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaTodosCamposObrigatorios';
      return false;
    }
  }

  // Valida se todos os dados preenchidos estão corretos.
  setReceivable(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.verifyRequired()) {
        return;
      }

      this.loading = true;
      try {
        // Campos obrigatórios
        this.billData.valorLiquido = this.billData.valorFatura;
        this.objCreateReceivable.dataEmissao = formatDateTimeString(this.billData.dataEmissao)!;
        this.objCreateReceivable.valorFatura = this.billData.valorFatura;
        this.objCreateReceivable.cnpjCliente = removeMaskCpfCnpj(this.billData.cnpj.split(' - ')[0]);
        this.objCreateReceivable.cdBanco = !isNaN(this.indexSelecteds.contaCorrente) ? this.dropdownsBack.contasCorrente[this.indexSelecteds.contaCorrente].cdPortador : this.billData.cdBanco;
        this.objCreateReceivable.cdConta = !isNaN(this.indexSelecteds.contaCorrente) ? this.dropdownsBack.contasCorrente[this.indexSelecteds.contaCorrente].cdConta : this.billData.cdConta;
        this.objCreateReceivable.dataVencimento = formatDateTimeString(`${this.billData.dataVencimento} - 00:00:00`)!;
        this.objCreateReceivable.documentosDeFrete = [];
        for (const cte of this.ctes) {
          this.objCreateReceivable.documentosDeFrete.push({
            noCTRC: cte.noCTRC,
            cdEmpresa: cte.cdEmpresa,
            cdFilEmp: cte.cdFilEmp,
          })
        }


        // Campos não obrigatórios
        this.objCreateReceivable.valorLiquido = this.billData.valorLiquido ? this.billData.valorLiquido : this.billData.valorFatura;
        this.objCreateReceivable.cdFilialCobranca = this.billData.filialCobranca
          ? !isNaN(this.indexSelecteds.filialCobranca)
            ? this.dropdownsBack.filiaisCobranca[this.indexSelecteds.filialCobranca].cdFilial
            : this.billData.cdFilialCobranca
          : '';
        this.objCreateReceivable.cdCondicaoPagamento = this.billData.descricao
          ? !isNaN(this.indexSelecteds.descricao)
            ? this.dropdownsBack.condicoesPagamento[this.indexSelecteds.descricao].cdCondPgto
            : this.billData.cdCondicaoPagamento
          : '';
        this.objCreateReceivable.cdGrupoReceita = this.billData.grupoReceita
          ? !isNaN(this.indexSelecteds.grupoReceita)
            ? this.dropdownsBack.gruposReceita[this.indexSelecteds.grupoReceita].cdGrupo
            : this.billData.cdGrupoReceita
          : '';
        this.objCreateReceivable.cdContaReceita = this.billData.contaReceita
          ? !isNaN(this.indexSelecteds.contaReceita)
            ? this.accountsReceiptBack[this.indexSelecteds.contaReceita].cdContas
            : this.billData.cdContaReceita
          : '';
        this.objCreateReceivable.cdCentroCustos = this.billData.centroCustos
          ? !isNaN(this.indexSelecteds.centroCustos)
            ? this.dropdownsBack.centroCusto[this.indexSelecteds.centroCustos].cdCentroCusto
            : this.billData.cdCentroCustos
          : '';
        this.objCreateReceivable.observacao = this.billData.observacao ? this.billData.observacao : '';
        this.objCreateReceivable.observacoesInternas = this.billData.observacaoInterna ? this.billData.observacaoInterna : '';
        this.formatCustomFieldToSend();

        if (this.idBill) {
          this.objCreateReceivable.noFatura = this.idBill;
          this.setCTes()
            .then(() => this.editReceivable())
            .then(() => this.getMovements());
        } else {
          this.createReceivable();
        }

        resolve();
      } catch (error) {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = 'insiraDataCorreta'
        reject(error);
      }
    })
  }

  // Atualiza os CT-es da fatura.
  setCTes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      const newCTes: FreightDocument[] = [];
      for (const cte of this.ctes) {
        newCTes.push({
          noCTRC: cte.noCTRC,
          cdEmpresa: cte.cdEmpresa,
          cdFilEmp: cte.cdFilEmp,
        })
      }
      const value: number = this.ctes.length === 0 ? this.billData.valorFatura : 0;

      this.receivableService.updateCTes(this.companyId, this.idBill, newCTes, value).subscribe({
        next: (response) => {
          this.loading = false;
          resolve();
        },
        error: (response) => {
          this.loading = false;
          this.snackbar.open = true;
          this.snackbar.message = 'erroAtualizarDocumentosFrete';
          this.ctes = [];
          reject();
        }
      })

    })
  }

  // Cria uma nova fatura.
  createReceivable() {
    this.receivableService.createBill(this.objCreateReceivable, this.companyId).subscribe({
      next: (response) => {
        this.setStepper(this.stageBillet, this.showCustomField);
        this.idBill = response.dados.fatura.noFatura;
        this.snackbar.open = true;
        this.snackbar.message = `Fatura ${this.idBill} criada com sucesso.`;

        this.router.navigate(['/accounts-receivable/actions'], {
          queryParams: { number: this.idBill }
        })
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca dos movimentos da fatura.
  getMovements() {
    this.receivableService.getMovements(this.companyId, this.idBill).subscribe({
      next: (response) => {
        this.movements = [];

        for (const movement of response.dados) {
          const movementObj: Movimento = <Movimento>{};
          movementObj.tipoMovimento = movement.nomeTipoMovimento;
          movementObj.valor = setCurrencyMask(movement.valorMovimento);
          movementObj.data = formatOnlyDateBack(movement.dataHoraMovimento) ? formatOnlyDateBack(movement.dataHoraMovimento)! : '';
          movementObj.dataInclusao = formatOnlyDateBack(movement.dataHoraInclusao) ? formatOnlyDateBack(movement.dataHoraInclusao)! : '';
          movementObj.usuario = movement.usuarioMovimento;
          movementObj.observacao = movement.histMov;
          movementObj.movimentaCaixa = movement.movimentaCaixa;
          if (movementObj.movimentaCaixa) {
            const digitoAgencia = movement.digitoAgencia !== null ? `-${movement.digitoAgencia}` : '';
            const digitoConta = movement.digitoConta !== null ? `-${movement.digitoConta}` : '';
            const nomeBanco = movement.nomeBanco;

            movementObj.contaCorrente = `${movement.agencia + digitoAgencia} / ${movement.conta + digitoConta} - ${nomeBanco}`
          }
          this.movements.push(movementObj);
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }


  // Edita a fatura.
  editReceivable() {
    this.receivableService.editBill(this.objCreateReceivable, this.companyId).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = `Fatura ${this.idBill} editada com sucesso.`;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Formata os campos perosnalizados para serem enviados ao backend.
  formatCustomFieldToSend() {
    if (this.customField.length >= 1) {
      this.registerCustomField = [];
      for (const field of this.customField) {
        const newField: RegisterCustomField = {
          idCampoPersonalizado: field.codigo,
          idExibicao: field.idExibicao,
          valor: typeWithItems(field.tipo)
            ? JSON.stringify(field.valor ? field.valor : '')
            : String(field.valor ? field.valor : '')
        }
        if (field.id) newField.id = field.id;
        if (field.tipo === TypeCustomField.Data) {
          newField.valor = String(field.valor).includes('-')
            ? formatDateUtcToBr(String(field.valor))
            : String(field.valor);

          if (newField.valor.includes('undefined') || newField.valor.includes('null')) newField.valor = '';
        }
        this.registerCustomField.push(newField);
      }
      this.objCreateReceivable.camposPersonalizados = this.registerCustomField;
    } else {
      this.objCreateReceivable.camposPersonalizados = null;
    }
  }


  //Recebe os dados da fatura
  getBillData(){
    this.billData = [
      {
        nFatura: 1,
        dataEmissao: '25/05/2023',
        valorFatura: 329,
        valorLiquido: 456,
        cnpj: '03.768.073/0001-16',
        nomeFantasia: 'abcde',
        cdCliente: '1234',
        contaCorrenteAgencia: '001',
        banco: 'banco x',
        descricao: 'abcde',
        dataVencimento: '09/04/2024',
        grupoReceita: 'grupo a' ,
        contaReceita: 'teste b' ,
        filialCobranca: 'teste c' ,
        centroCustos: 'teste d' ,
        observacao: 'observação',
        observacaoInterna: 'N/D',

        cdBanco: '002' ,
        cdConta: '003' ,
        cdCondicaoPagamento: '004' ,
        cdGrupoReceita: 'abcd' ,
        cdContaReceita: 'abcd' ,
        cdFilialCobranca: 'abcd' ,
        cdCentroCustos: 'abcd' ,
        status: 'Pendente' ,
        dataCancelamento: 'abcd' ,
        motivoCancelamento: 'abcd' ,
        usuarioCancelamento: 'abcd' ,
        dataBaixa: 'abcd' ,
        usuarioBaixa: 'abcd' ,
      }
    ]
  }

  //Define os steppers
  setStepper(billet?: boolean, displayField?: boolean){
    // if (!billet) {
      // if (!displayField) {

        if(this.customFieldData == true){
        this.steppers = [
          {
            src: 'register-white.svg',
            text: 'dadosDaFatura'
          },
          {
            src: 'receipt-grey.svg',
            text: 'documentosDaFatura',
            width: '13.125rem'
          },
          {
            src: 'register-white.svg',
            text: 'camposPersonalizados',
            width: '13.125rem'
          },
          {
            src: 'movements-grey.svg',
            text: 'movimentos',
          }
        ]
      } else {
        this.steppers = [
          {
            src: 'register-white.svg',
            text: 'dadosDaFatura'
          },
          {
            src: 'receipt-grey.svg',
            text: 'documentosDaFatura',
            width: '13.125rem'
          },
          {
            src: 'movements-grey.svg',
            text: 'movimentos',
          }
        ]
      }
      // }
      // else {
      //   this.steppers = [
      //     {
      //       src: 'register-white.svg',
      //       text: 'dadosDaFatura'
      //     },
      //     {
      //       src: 'receipt-grey.svg',
      //       text: 'documentosDeFrete',
      //       width: '13.125rem'
      //     },
      //     {
      //       src: 'register-white.svg',
      //       text: this.stepName,
      //       width: '100%'
      //     },
      //     {
      //       src: 'movements-grey.svg',
      //       text: 'movimentos',
      //       disabled: this.ableMovements
      //     }
      //   ]
      // }
    // }
    // else if (billet) {
    //   if (!displayField) {
    //     this.steppers = [
    //       {
    //         src: 'register-white.svg',
    //         text: 'dadosDaFatura'
    //       },
    //       {
    //         src: 'register-grey.svg',
    //         text: 'dadosDoBoleto'
    //       },
    //       {
    //         src: 'receipt-grey.svg',
    //         text: 'documentosDeFrete',
    //         width: '13.125rem'
    //       },
    //       {
    //         src: 'movements-grey.svg',
    //         text: 'movimentos',
    //       }
    //     ]
    //   }
      // else {
      //   this.steppers = [
      //     {
      //       src: 'register-white.svg',
      //       text: 'dadosDaFatura'
      //     },
      //     {
      //       src: 'register-grey.svg',
      //       text: 'dadosDoBoleto'
      //     },
      //     {
      //       src: 'receipt-grey.svg',
      //       text: 'documentosDeFrete',
      //       width: '13.125rem'
      //     },
      //     {
      //       src: 'register-white.svg',
      //       text: this.stepName,
      //       width: '100%'
      //     },
      //     {
      //       src: 'movements-grey.svg',
      //       text: 'movimentos',
      //     }
      //   ]
      // }
    // }
  }

  //Pula para o próximo stepper
  nextStepper() {
    if (this.stepperIndex !== this.steppers.length) {
      this.stepperIndex += 1
    }
  }

  //Volta para o stepper anterior
  backStepper() {
    if (this.stepperIndex !== 0) {
      this.stepperIndex -= 1
    }
  }

  //Volta para a lista
  close() {
    this.router.navigate(['/accounts-payable/list'])
  }

  // Realiza a busca das listagens para o dropdown.
  // getLists() {
  //   this.receivableService.getLists(this.companyId).subscribe({
  //     next: (response) => {
  //       this.dropdownsBack = response.dados;
  //       // Dropdown de conta corrente e agência
  //       this.lists.contasCorrenteAgencia = [];
  //       for (const account of response.dados.contasCorrente) {
  //         const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
  //         const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

  //         this.lists.contasCorrenteAgencia.push(
  //           `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`
  //         )
  //       }

  //       // Dropdown de grupo de receita
  //       this.lists.gruposReceita = [];
  //       for (const group of response.dados.gruposReceita) {
  //         this.lists.gruposReceita.push(group.dcGrupo)
  //       }

  //       // Dropdown de descrição de condições de pagamento
  //       this.lists.descricoes = [];
  //       for (const descrition of response.dados.condicoesPagamento) {
  //         this.lists.descricoes.push(descrition.dcCondPgto)
  //       }

  //       // Dropdown de filiais de cobrança
  //       this.lists.filiaisCobranca = [];
  //       for (const subsidiary of response.dados.filiaisCobranca) {
  //         this.lists.filiaisCobranca.push(subsidiary.nome)
  //       }

  //       // Dropdown de centros de custo
  //       this.lists.centrosCusto = [];
  //       for (const costCenter of response.dados.centroCusto) {
  //         this.lists.centrosCusto.push(costCenter.dcCentroCusto)
  //       }

  //     },
  //     error: (response) => {
  //       this.snackbar.open = true;
  //       this.snackbar.message = response.error.mensagem;
  //       this.snackbar.errorHandling = response.error.tratamentoErro;
  //     }
  //   })
  // };

  //Recebe os dados inputados pelo usuário na aba de campos personalizadoos
  handleFieldsUpdate(updatedFields: ExhibitionCustomField[]) {
    this.customField = updatedFields;
  }

  // Monta a exibição dos campos personalizados.
  loadCustomFields() {
    this.loading = true;
    this.customFieldService.getDisplayFields(this.companyId, Modules.ContasAReceber).subscribe({
      next: (response) => {
        this.showCustomField = true;
        this.customField = response.dados;
        this.stepName = response.dados[0].nomeExibicao;

        if (this.idBill) {
          this.getCtesBill();
          this.getDataReceivable();
          this.getMovements();
        } else {
          this.setStepper(this.stageBillet, this.showCustomField);
          this.loading = false;
        }
      },
      error: (response) => {
        this.showCustomField = false;
        this.loading = false;
        if (this.idBill) {
          this.getCtesBill();
          this.getDataReceivable();
          this.getMovements();
        } else {
          this.setStepper(this.stageBillet, this.showCustomField);
        }
      }
    })
  }

  // Busca os CT-es que estão vinculados à fatura.
  getCtesBill() {
    this.loading = true;
    this.receivableService.getCtesBill(this.companyId, this.idBill).subscribe({
      next: (response) => {
        this.ctes = response.dados;
        for (let index: number = 0; index < this.ctes.length; index++) {
          this.ctes[index].id = index;
          this.ctes[index].dataEmissao = formatOnlyDateBack(this.ctes[index].dataEmissao);
          this.ctes[index].valorFrete = setCurrencyMask(this.ctes[index].valorFrete);
        }

        this.ctes.length >= 1 ? this.disableValueBill = true : this.disableValueBill = false;

        this.loading = false;
      },
      error: (response) => {
        this.ctes.length >= 1 ? this.disableValueBill = true : this.disableValueBill = false;
        this.loading = false;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Busca os dados da fatura para edição.
  getDataReceivable() {
    this.receivableService.getDetailsReceivable(this.companyId, this.idBill).subscribe({
      next: (response) => {
        this.clientNameFilter = response.dados.nomeCliente;
        this.billData.nFatura = response.dados.numeroFatura;
        this.billData.dataEmissao = formatDateBack(response.dados.dataEmissao) ? formatDateBack(response.dados.dataEmissao)! : '';
        this.billData.valorFatura = response.dados.valorTotal;
        this.billData.valorLiquido = response.dados.valorLiquido;
        this.billData.cnpj = `${setMaskCpfCnpj(response.dados.cnpjCliente)} - ${response.dados.nomeCliente}`;
        const digitoAgencia = response.dados.agenciaDigito !== null ? `-${response.dados.agenciaDigito}` : '';
        const digitoConta = response.dados.contaCorrenteDigito !== null ? `-${response.dados.contaCorrenteDigito}` : '';
        this.billData.contaCorrenteAgencia = `${response.dados.agencia + digitoAgencia} / ${response.dados.contaCorrente + digitoConta}`
        this.billData.banco = response.dados.nomeBanco;
        this.billData.descricao = response.dados.nomeCondicaoPagamento;
        this.billData.dataVencimento = formatOnlyDateBack(response.dados.dataVencimento) ? formatOnlyDateBack(response.dados.dataVencimento)! : '';
        this.billData.grupoReceita = response.dados.nomeGrupoReceita;
        this.billData.contaReceita = response.dados.nomeContaReceita;
        this.billData.filialCobranca = response.dados.nomeFilialCobranca;
        this.billData.centroCustos = response.dados.nomeCentroCusto;
        this.billData.observacao = response.dados.observacao;
        this.billData.observacaoInterna = response.dados.observacoesInternas;
        this.billData.cdBanco = response.dados.codigoBanco;
        if (this.billData.cdBanco) this.getCurrentAccountByBank(this.billData.cdBanco);
        this.billData.cdConta = response.dados.cdContaCorrente;
        this.billData.cdCondicaoPagamento = response.dados.cdCondicaoPagamento;
        this.billData.cdGrupoReceita = response.dados.cdGrupoReceita;
        if (this.billData.cdGrupoReceita) this.getReceiptAccount();
        this.billData.cdContaReceita = response.dados.cdContaReceita;
        this.billData.cdFilialCobranca = response.dados.cdFilialCobranca;
        this.billData.cdCentroCustos = response.dados.cdCentroCusto;
        this.billData.status = response.dados.status;
        this.billData.dataCancelamento = formatDateBack(response.dados.dataCancelamento) ? formatDateBack(response.dados.dataCancelamento)! : '';
        this.billData.motivoCancelamento = response.dados.motivoCancelamento;
        this.billData.usuarioCancelamento = response.dados.usuarioCancelamento;
        this.billData.dataBaixa = formatOnlyDateBack(response.dados.dataBaixa) ? formatOnlyDateBack(response.dados.dataBaixa)! : '';
        this.billData.usuarioBaixa = response.dados.usuarioBaixa;

        // Campos personalizados.
        this.registerCustomField = response.dados.camposPersonalizados;
        this.buildCustomField();

        // Dados do boleto
        this.billetData.numeroBoleto = response.dados.numeroBoleto;
        this.billetData.dataEmissao = formatDateBack(response.dados.dataEmissaoBoleto) ? formatDateBack(response.dados.dataEmissaoBoleto)! : '';
        this.billetData.juros = setCurrencyMask(response.dados.valorJurosBoleto);
        this.billetData.multa = setCurrencyMask(response.dados.valorMultaBoleto);
        this.billetData.status = response.dados.statusBoleto;
        this.billetData.codigoBarras = response.dados.codigoDeBarrasBoleto;
        this.billetData.codigoPix = response.dados.codigoPixBoleto;

        if (this.billetData.numeroBoleto === null) {
          this.stageBillet = false;
        } else {
          this.stageBillet = true;
        }

        this.setStepper(this.stageBillet, this.showCustomField);

        if (this.billData.status === 'Cancelada' || this.billData.status === 'Baixada') this.disableEdit = true;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca das contas de receita.
  getBanks() {
    this.receivableService.getBanks(this.companyId).subscribe({
      next: (response) => {
        this.banksList = response.dados;

        this.lists.bancos = [];
        for (const bank of this.banksList) {
          this.lists.bancos.push(bank.nome);
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  bankSeleced(bankCode: string | null) {
    if (bankCode !== null) {
      this.getCurrentAccountByBank(bankCode);
    } else {
      // this.getLists()
    }
  }

  getCurrentAccountByBank(bankCode: string) {
    this.receivableService.getCurrentAccountByBank(this.companyId, bankCode).subscribe({
      next: (response) => {
        this.dropdownsBack.contasCorrente = {};
        this.dropdownsBack.contasCorrente = response.dados;
        // Dropdown de conta corrente e agência
        this.lists.contasCorrenteAgencia = [];
        for (const account of response.dados) {
          const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

          this.lists.contasCorrenteAgencia.push(
            `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`
          )
        }

        if (this.billData.contaCorrenteAgencia) {
          this.indexSelecteds.contaCorrente = this.lists.contasCorrenteAgencia.findIndex((account: string) => account === this.billData.contaCorrenteAgencia);
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca das contas de receita.
  getReceiptAccount() {
    this.loading = true;
    const cdGroup = this.billData.cdGrupoReceita ? this.billData.cdGrupoReceita : this.dropdownsBack.gruposReceita[this.indexSelecteds.grupoReceita].cdGrupo

    this.receivableService.getReceiptAccount(this.companyId, cdGroup).subscribe({
      next: (response) => {
        this.accountsReceiptBack = response.dados;
        // Dropdown de contas de receita
        this.lists.contasReceita = [];
        for (const receiptAccount of response.dados) {
          this.lists.contasReceita.push(receiptAccount.dcContas)
        }

        this.loading = false;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.loading = false;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Monta os campos personalizados de acordo com os valores retornados pelo backend.
  buildCustomField() {
    this.registerCustomField.forEach(fieldRegistered => {
      const fieldIndex = this.customField.findIndex(
        field => field.codigo === fieldRegistered.idCampoPersonalizado
      );

      if (fieldIndex !== -1) {
        const field = this.customField[fieldIndex];
        const isTypeWithItems: boolean = typeWithItems(field.tipo);

        if (isTypeWithItems) {
          const values = JSON.parse(fieldRegistered.valor);
          field.valor = values.length >= 1 ? values : null;
        } else {
          field.valor = fieldRegistered.valor;
        }

        field.id = fieldRegistered.id;
        this.customField[fieldIndex] = field;
      }
    });
  }

}
