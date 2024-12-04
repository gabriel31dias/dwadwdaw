import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StepperModel } from 'src/app/modules/shared/models/stepper.model';
import { DadosFatura, ListasDadosFatura } from '../../models/bill-include.model';
import { ReceivableService } from '../../services/receivable.service';
import { IndexListsBillData } from '../../models/index-lists-selected.model';
import { Movimento } from '../../models/movement.model';
import { CreateAccountReceivable, FreightDocument } from '../../models/create-account-receivable.model';
import { formatDateBack, formatDateTimeString, formatDateUtcToBr, formatOnlyDateBack } from 'src/app/modules/shared/utils/date-utils';
import { removeMaskCpfCnpj, setMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { removeCurrencyMask, setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { DadosBoletoFatura } from '../../models/billet-data.model';
import { DetailsStatus } from 'src/app/modules/shared/models/details-status.model';
import { ModalDetailsStatusComponent } from 'src/app/modules/shared/components/modais/modal-details-status/modal-details-status.component';
import { CustomFieldService } from 'src/app/modules/settings/services/custom-field.service';
import { ExhibitionCustomField, RegisterCustomField } from 'src/app/modules/shared/models/exhibition-custom-field.model';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { TypeCustomField, typeWithItems } from 'src/app/modules/settings/models/type-custom-field';
import { ContasAReceberPermissoes } from 'src/app/modules/shared/consts/permissions.const';

@Component({
  selector: 'app-actions-receivable',
  templateUrl: './actions-receivable.component.html',
  styleUrls: ['./actions-receivable.component.scss']
})
export class ActionsReceivableComponent implements OnChanges{

  companyId: string;
  permissions: string[];
  authReceivable = ContasAReceberPermissoes;
  steppers: StepperModel[] = [];
  stepperIndex: number = 0;
  idInvoice: number | null = null;
  loading: boolean = false;
  alertRequired: boolean = false;
  snackbar: Snackbar = new Snackbar();
  lists: ListasDadosFatura = <ListasDadosFatura>{};
  billData: DadosFatura = <DadosFatura>{};
  ctes: any[] = [];
  dropdownsBack: any;
  accountsReceiptBack: any;
  indexSelecteds: IndexListsBillData = <IndexListsBillData>{};
  movements: Movimento[] = [];
  objCreateReceivable: CreateAccountReceivable = <CreateAccountReceivable>{};
  idBill: string = '';
  stageBillet: boolean = false;
  billetData: DadosBoletoFatura = <DadosBoletoFatura>{};
  disableValueBill: boolean = false;
  disableEdit: boolean = false;
  banksList: any[] = [];
  @Input() clientNameFilter: string = '';
  customField: ExhibitionCustomField[] = [];
  nReceivable: number | null = null;
  stepName: string = '';
  showCustomField: boolean = false;
  ableMovements: boolean = true;
  registerCustomField: RegisterCustomField[] = [];

  constructor(private translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private receivableService: ReceivableService,
    private modalService: NgbModal,
    private customFieldService: CustomFieldService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();

    if (!this.permissions.includes(this.authReceivable.Visualizar)
      && !this.permissions.includes(this.authReceivable.Incluir)
    ) {
      this.close();
    }

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        if (!this.permissions.includes(this.authReceivable.Visualizar)) this.close();
        this.idBill = queryParams['number'];
        this.disableValueBill = true;
      }
    })

    this.reloadAll();

    if (!this.idBill && !this.permissions.includes(this.authReceivable.Incluir)) {
      this.snackbar.open = true;
      this.snackbar.timeHide = 10000;
      this.snackbar.message = 'usuarioSemPermissaoCadastroContasAReceber';

      setTimeout(() => {
        this.close()
      }, this.snackbar.timeHide * 2);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientNameFilter']) {
      this.clientNameFilter = changes['clientNameFilter'].currentValue;
    }
  }

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

  // Define as etapas da tela.
  setStepper(billet?: boolean, displayField?: boolean){
    if (!billet) {
      if (!displayField) {
        this.steppers = [
          {
            src: 'register-white.svg',
            text: 'dadosDaFatura'
          },
          {
            src: 'receipt-grey.svg',
            text: 'documentosDeFrete',
            width: '13.125rem'
          },
          {
            src: 'movements-grey.svg',
            text: 'movimentos',
            disabled: this.ableMovements
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
            text: 'documentosDeFrete',
            width: '13.125rem'
          },
          {
            src: 'register-white.svg',
            text: this.stepName,
            width: '100%'
          },
          {
            src: 'movements-grey.svg',
            text: 'movimentos',
            disabled: this.ableMovements
          }
        ]
      }
    } else if (billet) {
      if (!displayField) {
        this.steppers = [
          {
            src: 'register-white.svg',
            text: 'dadosDaFatura'
          },
          {
            src: 'register-grey.svg',
            text: 'dadosDoBoleto'
          },
          {
            src: 'receipt-grey.svg',
            text: 'documentosDeFrete',
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
            src: 'register-grey.svg',
            text: 'dadosDoBoleto'
          },
          {
            src: 'receipt-grey.svg',
            text: 'documentosDeFrete',
            width: '13.125rem'
          },
          {
            src: 'register-white.svg',
            text: this.stepName,
            width: '100%'
          },
          {
            src: 'movements-grey.svg',
            text: 'movimentos',
          }
        ]
      }
    }
  }

  // Avança uma etapa.
  nextStepper() {
    if (this.stepperIndex !== this.steppers.length) {
      this.stepperIndex += 1
    }
  }

  // Volta uma etapa.
  backStepper() {
    if (this.stepperIndex !== 0) {
      this.stepperIndex -= 1
    }
  }

  // Direciona o usuário para a tela de listagem de contas a receber.
  close() {
    this.router.navigate(['/accounts-receivable/list'])
  }

  // Verifica se o usuário preencheu todos os campos obrigatórios.
  verifyRequired(): boolean {
    if (this.billData.dataEmissao &&
      this.billData.cnpj &&
      this.billData.contaCorrenteAgencia &&
      this.billData.dataVencimento
    ) {
      if (this.billData.valorFatura || this.ctes.length >= 1) {
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
        this.objCreateReceivable.dataVencimento = `${this.billData.dataVencimento}T00:00:00`;
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

        this.reloadAll()
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Realiza a busca das listagens para o dropdown.
  getLists() {
    this.receivableService.getLists(this.companyId).subscribe({
      next: (response) => {
        this.dropdownsBack = response.dados;
        // Dropdown de conta corrente e agência
        this.lists.contasCorrenteAgencia = [];
        for (const account of response.dados.contasCorrente) {
          const digitoAgencia = account.digitoAgencia !== null ? `-${account.digitoAgencia}` : '';
          const digitoConta = account.digitoConta !== null ? `-${account.digitoConta}` : '';

          this.lists.contasCorrenteAgencia.push(
            `${account.agencia + digitoAgencia} / ${account.conta + digitoConta}`
          )
        }

        // Dropdown de grupo de receita
        this.lists.gruposReceita = [];
        for (const group of response.dados.gruposReceita) {
          this.lists.gruposReceita.push(group.dcGrupo)
        }

        // Dropdown de descrição de condições de pagamento
        this.lists.descricoes = [];
        for (const descrition of response.dados.condicoesPagamento) {
          this.lists.descricoes.push(descrition.dcCondPgto)
        }

        // Dropdown de filiais de cobrança
        this.lists.filiaisCobranca = [];
        for (const subsidiary of response.dados.filiaisCobranca) {
          this.lists.filiaisCobranca.push(subsidiary.nome)
        }

        // Dropdown de centros de custo
        this.lists.centrosCusto = [];
        for (const costCenter of response.dados.centroCusto) {
          this.lists.centrosCusto.push(costCenter.dcCentroCusto)
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
      this.getLists()
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
        const dataVenc = response.dados.dataVencimento.split('T')[0];
        this.billData.dataVencimento = dataVenc ? dataVenc : '';
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

  // Busca os CT-es que estão vinculados à fatura.
  getCtesBill() {
    this.loading = true;
    this.receivableService.getCtesBill(this.companyId, this.idBill).subscribe({
      next: (response) => {
        this.ctes = response.dados ? response.dados : [];
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

  // Aplica as modificações nos campos necessários quando é realizada alguma alteração em documentos de frete.
  ctesChanged(newCtes: any[]) {
    if (!this.idBill) {
      let freightTotal: number = 0;
      for (const cte of newCtes) {
        freightTotal = freightTotal + removeCurrencyMask(cte.valorFrete);
      }

      this.billData.valorFatura = freightTotal;
      this.billData.valorLiquido = this.billData.valorFatura;
    } else {
      if (newCtes.length === 0) {
        this.billData.valorFatura = 0;
        this.alertRequired = true;
      } else {
        this.setCTes()
          .then(() => this.getDataReceivable())
          .then(() => this.getMovements())
          .catch(() => this.getCtesBill());
      }
    }
    this.ctes.length >= 1 ? this.disableValueBill = true : this.disableValueBill = false;
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

  // Abre o modal de detalhamento do status da fatura.
  openModalDetailsReceivable() {
    const details: DetailsStatus = <DetailsStatus>{}
    details.idItem = `Fatura ${this.billData.nFatura}`;
    details.status = this.billData.status!;

    if (this.billData.status === 'Cancelada') {
      details.data = this.billData.dataCancelamento!;
      details.usuario = this.billData.usuarioCancelamento!;
      details.motivo = this.billData.motivoCancelamento!;
    }

    if (this.billData.status === 'Baixada') {
      details.data = this.billData.dataBaixa!;
      details.usuario = this.billData.usuarioBaixa!;
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-details-status',
    };

    const modalRef = this.modalService.open(ModalDetailsStatusComponent, modalOptions);
    modalRef.componentInstance.details = details;
  }

  // Atualiza todos os dados da fatura.
  updateAll() {
    this.getCtesBill();
    this.getDataReceivable();
    this.getMovements();
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

  //Recebe os dados inputados pelo usuário na aba de campos personalizadoos
  handleFieldsUpdate(updatedFields: ExhibitionCustomField[]) {
    this.customField = updatedFields;
  }

  reloadAll() {
    this.loadCustomFields();

    this.getLists();
    this.getBanks();

    if (this.idBill) {
      this.ableMovements = false;
      this.setStepper(this.stageBillet, this.showCustomField);
    } else {
      this.ableMovements = true;
      this.setStepper(false, this.showCustomField);
      this.getDateTime();
    }
  }

  verifyPermissionsToShowBtn(): boolean {
    if (this.idBill && !this.permissions.includes(this.authReceivable.Editar)) return false;
    if (!this.idBill && !this.permissions.includes(this.authReceivable.Incluir)) return false;

    return true;
  }

  disableFields(): boolean {
    if (!this.idBill && this.permissions.includes(this.authReceivable.Incluir)) return false;
    if (this.idBill
      && this.permissions.includes(this.authReceivable.Editar)
      && !this.disableEdit
    ) return false;

    return true;
  }

}
