import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-include-supplier',
  templateUrl: './modal-include-supplier.component.html',
  styleUrls: ['./modal-include-supplier.component.scss']
})
export class ModalIncludeSupplierComponent implements OnInit {

  optionsUfs: string [] = ['SP', 'RJ', 'MG'];
  ufs: any = <any>{};
  @Input() alertRequired: boolean = false;
  readonly: boolean = false;

  constructor(private translate: TranslateService, private modal: NgbActiveModal){
    translate.use('pt-br')
  }


  ngOnInit(): void {
    this.getFiliais()
  }

  close(){
    this.modal.close();
  }

  getFiliais(){
    this.ufs =
    {
      id: 1,
      nome: 'Teste',
      tipo: 'Teste'
    }
  }

}
