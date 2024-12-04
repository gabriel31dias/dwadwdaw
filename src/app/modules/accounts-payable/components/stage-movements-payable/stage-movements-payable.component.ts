import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ModalLaunchMovementComponent } from 'src/app/modules/accounts-receivable/modais/modal-launch-movement/modal-launch-movement.component';
import { Movimento } from 'src/app/modules/accounts-receivable/models/movement.model';
import { ReceivableService } from 'src/app/modules/accounts-receivable/services/receivable.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
@Component({
  selector: 'app-stage-movements-payable',
  templateUrl: './stage-movements-payable.component.html',
  styleUrls: ['./stage-movements-payable.component.scss']
})
export class StageMovementsPayableComponent {

  companyId: string;
  movement: any[] = [];
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  columns: ColumnSlickGrid[] = [];
  @Input() movements: Movimento[] = [];
  @Output() updateAll: EventEmitter<any> = new EventEmitter<any>();
  headers: string[] = [ 'movimento', 'valor', 'data', 'usuario' ]
  idBill: string = '';
  @Input() disableEdit: boolean = false;
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

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.idBill = queryParams['number'];
      }
    })
    this.updateHeightTable();
    this.getMovement();

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
  getMovement() {
    this.movement = [
      {
        id: 1,
        movimento: 'Carlos dos Santos Bittencourt',
        valor: '0000-0',
        data: 'Banco Bradesco S.A.',
        usuario: 'Lorem ipsum',

      },


    ];
  }
}
