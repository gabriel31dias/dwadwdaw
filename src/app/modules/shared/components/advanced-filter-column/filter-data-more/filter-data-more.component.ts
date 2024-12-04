import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchColumnFilter } from '../../../models/filter-column.model';

@Component({
  selector: 'app-filter-data-more',
  templateUrl: './filter-data-more.component.html',
  styleUrls: ['./filter-data-more.component.scss']
})
export class FilterDataMoreComponent {

  editFilter: boolean = false;
  @Input() filter: SearchColumnFilter = <SearchColumnFilter>{};
  @Input() indexFilter: number | null = null;
  @Output() clear = new EventEmitter<SearchColumnFilter>();
  @Output() filterUpdated = new EventEmitter<{ filter: SearchColumnFilter, indexFilter: number | null }>();

  constructor(private translate: TranslateService) {
    translate.use('pt-br');
  }

  updateFilter(newFilter: SearchColumnFilter) {
    this.filter = newFilter;
    this.editFilter = false;
    this.filterUpdated.emit({filter: this.filter, indexFilter: this.indexFilter});
  }

}
