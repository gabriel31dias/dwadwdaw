import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Movimento } from 'src/app/modules/accounts-receivable/models/movement.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ConferenciaPermissoes } from '../../../consts/permissions.const';

@Component({
  selector: 'app-table-sort',
  templateUrl: './table-sort.component.html',
  styleUrls: ['./table-sort.component.scss']
})
export class TableSortComponent {

  @Input() headers: string[] = [];
  @Input() records: any[] = [];
  @Input() viewDetailSection: boolean = false;
  @Input() viewDetailSectionRoutines: boolean = false;
  @Output() recordViewDetail = new EventEmitter<any>();
  @Input() isConference: boolean = false;
  @Input() isConferenceNF: boolean = false;
  @Input() checkedWithDisagreement: boolean = false;
  sortBy: string = '';
  reverse: boolean = false;
  @Input() height: string = 'auto';
  @Input() maxHeight: string = 'auto';
  @Output() printVolume = new EventEmitter<any>();
  @Input() isMovement: boolean = false;
  @Output() movementEmitter = new EventEmitter<Movimento>();
  @Input() actionDelete: boolean = false;
  @Output() deleteData = new EventEmitter<any>();
  @Output() addObservation = new EventEmitter<any>();
  permissions: string [] = [];
  authConference = ConferenciaPermissoes;

  constructor(private translate: TranslateService,
    private storageService: StorageService
  ) {
    translate.use('pt-br');
    this.permissions = storageService.getPermissionsUser();
  }



  sortData(header: string) {
    if (this.sortBy === header) {
      this.reverse = !this.reverse;
    } else {
      this.sortBy = header;
      this.reverse = false;
    }
  }

  viewDetail(record: any) {
    this.recordViewDetail.emit(record);
  }
}
