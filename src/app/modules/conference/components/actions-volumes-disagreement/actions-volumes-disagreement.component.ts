import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ConferenceService } from '../../services/conference.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';

@Component({
  selector: 'app-actions-volumes-disagreement',
  templateUrl: './actions-volumes-disagreement.component.html',
  styleUrls: ['./actions-volumes-disagreement.component.scss']
})
export class ActionsVolumesDisagreementComponent {

  companyId: string;
  permissions: string [] = [];
  authConference = ConferenciaPermissoes;
  nConference: number | null = null;
  currentStatus: number = 0;
  statusEnum: string = 'Não encontrado';
  invoices: any = <any>{};
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  readonly: boolean = true;
  dadoVolume: any = <any>{};

  constructor(private translate: TranslateService, private storageService: StorageService, private modalService: NgbModal, private conferenceService: ConferenceService, private router: Router){
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();
    translate.use('pt-br')
    this.getDadosVolume();
  }

  doSearch(event: any){

  }

  conferenceFinished(): boolean {
    if (this.currentStatus === 2 || this.currentStatus === 3 || this.currentStatus === 4) {
      return true;
    } else {
      return false;
    }
  }

  close(){
    this.router.navigate(['/conference/volumes-disagreement'])
  }

  defineAction(){

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
