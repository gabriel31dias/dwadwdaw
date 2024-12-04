import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-observation',
  templateUrl: './modal-observation.component.html',
  styleUrls: ['./modal-observation.component.scss']
})
export class ModalObservationComponent implements OnInit {


  dadoVolume: any = <any>{};
  constructor(private translate: TranslateService, private modal: NgbActiveModal){
    translate.use('pt-br')
  }

  ngOnInit(): void {
    this.getDadosVolume();
  }

  close(){
    this.modal.close();
  }

  getDadosVolume(){
    this.dadoVolume = {
      id: 1,
      codigoDoVolume: 1,
      data: '27/03/2024',
      horario: '14:00',
      usuarioConferencia: 'Igor Ghiberti',
      numeroVolume: '5324',
      observacoes: 'Lorem Ipsum',
      encontrado: true
    };
  }

}
