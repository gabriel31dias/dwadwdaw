import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ConferenceService } from '../../services/conference.service';
import { ActivatedRoute } from '@angular/router';
import { ModalSearchSupplierComponent } from '../modal-search-supplier/modal-search-supplier.component';

@Component({
  selector: 'app-modal-generate-title',
  templateUrl: './modal-generate-title.component.html',
  styleUrls: ['./modal-generate-title.component.scss']
})
export class ModalGenerateTitleComponent implements OnInit{

  companyId: string;
  optionsFilial: string [] = ['Teste 1', 'Teste2', 'Teste 3'];
  filiais: any = <any>{};
  @Input() alertRequired: boolean = false;
  optionsBancos: string [] = ['Teste 1', 'Teste2', 'Teste 3'];
  bancos: any = <any>{};
  optionsGrupoPagamento: string [] = ['Teste 1', 'Teste2', 'Teste 3'];
  grupoPagamento: any = <any>{};
  optionsContasDePagamento: string [] = ['Teste 1', 'Teste2', 'Teste 3'];
  contasDePagamento: any = <any>{};
  optionsCentroDeCusto: string [] = ['Teste 1', 'Teste2', 'Teste 3'];
  centroDeCusto: any = <any>{};
  optionsQuantidadeDeParcelas: string [] = ['Teste 1', 'Teste2', 'Teste 3'];
  quantidadeDeParcelas: any = <any>{};
  notaFiscal: any = <any>{};
  readonly: boolean = false;
  nConference: number = 0;
  buscaAvancada: string [] = [];

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private storageService: StorageService,
    private conferenceService: ConferenceService,
    private route: ActivatedRoute)

    {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.nConference = queryParams['number'];
      }
    })
    }
  ngOnInit(): void {
    this.getBancos();
    this.getCentroDeCusto();
    this.getContasDePagamento();
    this.getFiliais();
    this.getGrupoPagamento();
    this.getNotaFiscal();
    this.getQuantidadeDeParcelas();
  }

  getFiliais(){
    this.filiais =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

  getBancos(){
    this.bancos =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

  getGrupoPagamento(){
    this.grupoPagamento =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

  getContasDePagamento(){
    this.contasDePagamento =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

  getCentroDeCusto(){
    this.centroDeCusto =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

  getQuantidadeDeParcelas(){
    this.quantidadeDeParcelas =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

  doSearch(event: any){

  }

  getNotaFiscal(){
    this.quantidadeDeParcelas =
    {
      id: 1,
      nota: 'Teste'
    }
  }

  close(){
    this.modal.close();
  }

  defineAction(){

  }

  openModalSearchSupplier(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-generate-title',
    };
    const modalRef = this.modalService.open(ModalSearchSupplierComponent, modalOptions);
  }

}
