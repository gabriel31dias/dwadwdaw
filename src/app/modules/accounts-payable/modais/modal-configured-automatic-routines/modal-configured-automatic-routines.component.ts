import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';

@Component({
  selector: 'app-modal-configured-automatic-routines',
  templateUrl: './modal-configured-automatic-routines.component.html',
  styleUrls: ['./modal-configured-automatic-routines.component.scss']
})
export class ModalConfiguredAutomaticRoutinesComponent {

  routines: any[] = [];
  columns: ColumnSlickGrid[] = [];
  routinesSelected: any[] = [];
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  customHeight: number = 285;

  constructor(private router: Router, private storage: StorageService, private modalService: NgbModal, private modal: NgbActiveModal) {
    this.getRoutines();
    this.getHeaderTable()
  }

  // Monta o header da tabela (slickgrid).
  getHeaderTable(): string[] {
    const columns: ColumnSlickGrid[] = [
      { name: 'clientes', id: 'clientes', width: 100 },
      { name: 'contaCorrente', id: 'contaCorrente', width: 100 },
      { name: 'banco', id: 'banco', width: 100 },
      { name: 'condicaoPagamento', id: 'condicaoPagamento', width: 100 },
      { name: 'tipoDocumento', id: 'tipoDocumento', width: 100 },
      { name: 'diaProcessamento', id: 'diaProcessamento', width: 100 },
    ];

    return columns.map(column => column.name);
  }

  // Define a altura da tabela (slickgrid).
  setHeightTable() {
    const increment = 40;
    const maxHeight = 445;

    this.customHeight = 85;
    for (const routines of this.routines) {
      if (this.customHeight < maxHeight) {
        this.customHeight += increment;
      }
    }
  }

  // Realiza a busca das contas.
  getRoutines() {
    this.routines = [
      {
        id: 1,
        clientes: 'Carlos dos Santos Bittencourt',
        contaCorrente: '0000-0',
        banco: 'Banco Bradesco S.A.',
        condicaoPagamento: 'Lorem ipsum',
        tipoDocumento: 'Lorem ipsum',
        diaProcessamento: 'Lorem ipsum',
      },
      {
        id: 2,
        clientes: 'Pablo Maciel Silva',
        contaCorrente: '0000-0',
        banco: 'Banco Bradesco S.A.',
        condicaoPagamento: 'Lorem ipsum',
        tipoDocumento: 'Lorem ipsum',
        diaProcessamento: 'Lorem ipsum',
      },
    ];

    this.setHeightTable();

  }

  // Grava os registros que foram selecionados pelo usuário (slickgrid).
  rowsSelected(selected: any[]) {
    this.routinesSelected = [...selected];
  }


  close() {
    this.modal.close(false);
  }

  confirm() {
    this.modal.close(true);
  }

  viewDetail(record: any) {

    this.router.navigate(['settings/systems-registration/actions']);
  }


}
