import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ModalLaunchMovementComponent } from '../../modais/modal-launch-movement/modal-launch-movement.component';
import { Movimento } from '../../models/movement.model';
import { ReceivableService } from '../../services/receivable.service';
import { ContasAReceberPermissoes } from 'src/app/modules/shared/consts/permissions.const';

@Component({
  selector: 'app-stage-movements',
  templateUrl: './stage-movements.component.html',
  styleUrls: ['./stage-movements.component.scss']
})
export class StageMovementsComponent {

  companyId: string;
  permissions: string[];
  authReceivable = ContasAReceberPermissoes;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  columns: ColumnSlickGrid[] = [];
  @Input() movements: Movimento[] = [];
  @Output() updateAll: EventEmitter<any> = new EventEmitter<any>();
  headers: string[] = [ 'tipoMovimento', 'valor', 'data', 'usuario' ]
  idBill: string = '';
  @Input() disableFields: boolean = false;
  heightScreen: number = 0;
  maxHeightTable: string = '';

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private readonly storageService: StorageService,
    private route: ActivatedRoute,
    private receivableService: ReceivableService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.idBill = queryParams['number'];
      }
    })
    this.updateHeightTable();

  }

  // Função para tornar a tabela de listagem de volumes responsiva à altura da tela do usuário.
  updateHeightTable() {
    this.heightScreen = window.innerHeight;

    const count = Math.floor((this.heightScreen/2.9));
    this.maxHeightTable = count + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Atualiza a altura da tabela quando a janela é redimensionada.
    this.updateHeightTable();
  }

  launchMovement(movement?: Movimento) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-launch-movement',
    };
    const modalRef = this.modalService.open(ModalLaunchMovementComponent, modalOptions);
    modalRef.componentInstance.idBill = this.idBill;
    if (movement) {
      modalRef.componentInstance.onlyView = true;
      modalRef.componentInstance.movement = movement;
    }

    modalRef.result
      .then((result) => {
        if (result === 'success') {
          this.snackbar.open = true;
          this.snackbar.message = 'movimentoLancadoComSucesso';
          this.updateAll.emit();
        }
      })
      .catch((res) => {

      })
  }

}
