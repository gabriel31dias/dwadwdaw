import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { ModalIncludeClientComponent } from '../modal-include-client/modal-include-client.component';
import { columnSearchClientId, configSearchClient } from 'src/app/modules/shared/consts/column-modal-search-client';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ClientService } from '../../../services/client.service';
import { hiddenModal, visibleModal } from 'src/app/modules/shared/utils/modal-utils';

@Component({
  selector: 'app-modal-search-client',
  templateUrl: './modal-search-client.component.html',
  styleUrls: ['./modal-search-client.component.scss']
})
export class ModalSearchClientComponent {

  companyId: string;
  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  clients: any[] = [];
  clientSelected: any;
  search: string = '';
  snackbar: Snackbar = new Snackbar();
  loading: boolean = true;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private storageService: StorageService,
    private clientService: ClientService
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;

    this.columns = configSearchClient;
    this.getClients();
  }

  getClients() {
    this.loading = true;
    this.clientService.getClients(this.companyId, this.search, columnSearchClientId).subscribe({
      next: (response) => {
        this.clients = response.dados;
        let count = 0;
        for (const client of this.clients) {
          client.id = count;
          count++;
        }
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

  close() {
    this.modal.close();
  }

  doSearch(search: string) {
    this.search = search;
    this.getClients();
  }

  openModalNewClient() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalIncludeClientComponent, modalOptions);

    this.modal.update(hiddenModal);
    modalRef.dismissed.subscribe(() => {
      this.modal.update(visibleModal);
    });

    modalRef.result.then((res: any) => {
      this.modal.update(visibleModal);
      if (res) {
        const clientCreated = res;
        this.modal.close(clientCreated)
      }
    })
    .catch((res) => {
      this.modal.update(visibleModal);
    })
  }

  userSelected(selected: any) {
    this.clientSelected = '';
    this.clientSelected = this.clients[selected];
  }

  confirmSelected() {
    this.modal.close(this.clientSelected);
  }

}
