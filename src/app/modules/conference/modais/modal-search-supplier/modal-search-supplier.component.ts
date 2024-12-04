import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { ModalIncludeSupplierComponent } from '../modal-include-supplier/modal-include-supplier.component';

@Component({
  selector: 'app-modal-search-supplier',
  templateUrl: './modal-search-supplier.component.html',
  styleUrls: ['./modal-search-supplier.component.scss']
})
export class ModalSearchSupplierComponent {

  columns: ColumnSlickGrid[] = [];
  columnsHide: any[] = [];
  suppliers: any[] = [];
  supplierSelected: any;

  constructor(private modal: NgbActiveModal, private modalService: NgbModal){
    this.getColumns();
    this.getSuppliers();
  }

  close() {
    this.modal.close();
  }

  doSearch(event: any){

  }

  openModalNewSupplier(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-include-nf',
    };
    const modalRef = this.modalService.open(ModalIncludeSupplierComponent, modalOptions);

  }

  userSelected(selected: any) {
    this.supplierSelected = '';
    this.supplierSelected = this.suppliers[selected];
  }

  confirmSelected() {
    this.modal.close(this.supplierSelected);
  }

  getSuppliers(){
    this.suppliers = [
      {
      id: 1,
      situacao: 'Ativa',
      cpfCnpj: '05.943.708/0001-08',
      razaoSocial: 'Abner Lima dos Santos Xavier',
      nomeFantasia: 'Abner Lima dos Santos Xavier',
      endereco: 'Rua Conceição Cruz, 895',
      cep: '57032-011',
      telefone: '(11) 92745-3921',
      cidade: 'São Paulo',
      uf: 'SP'
      },
      {
        id: 2,
        situacao: 'Ativa',
        cpfCnpj: '05.943.708/0001-08',
        razaoSocial: 'Abner Lima dos Santos Xavier',
        nomeFantasia: 'Abner Lima dos Santos Xavier',
        endereco: 'Rua Conceição Cruz, 895',
        cep: '57032-011',
        telefone: '(11) 92745-3921',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      {
        id: 3,
        situacao: 'Ativa',
        cpfCnpj: '05.943.708/0001-08',
        razaoSocial: 'Abner Lima dos Santos Xavier',
        nomeFantasia: 'Abner Lima dos Santos Xavier',
        endereco: 'Rua Conceição Cruz, 895',
        cep: '57032-011',
        telefone: '(11) 92745-3921',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      {
        id: 4,
        situacao: 'Ativa',
        cpfCnpj: '05.943.708/0001-08',
        razaoSocial: 'Abner Lima dos Santos Xavier',
        nomeFantasia: 'Abner Lima dos Santos Xavier',
        endereco: 'Rua Conceição Cruz, 895',
        cep: '57032-011',
        telefone: '(11) 92745-3921',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      {
        id: 5,
        situacao: 'Ativa',
        cpfCnpj: '05.943.708/0001-08',
        razaoSocial: 'Abner Lima dos Santos Xavier',
        nomeFantasia: 'Abner Lima dos Santos Xavier',
        endereco: 'Rua Conceição Cruz, 895',
        cep: '57032-011',
        telefone: '(11) 92745-3921',
        cidade: 'São Paulo',
        uf: 'SP'
      },
    ];
  }

  getColumns(){
    this.columns = [
      {name: 'Situação', id: 'situacao', width: 150},
      {name: 'CPF/CNPJ', id: 'cpfCnpj', width: 150},
      {name: 'Nome Fantasia', id: 'nomeFantasia', width: 200},
      {name: 'Endereço', id: 'endereco', width: 150},
      {name: 'CEP', id: 'cep', width: 150},
      {name: 'Telefone', id: 'telefone', width: 150},
      {name: 'Cidade', id: 'cidade', width: 150},
      {name: 'UF', id: 'uf', width: 150}
    ];
  }

}
