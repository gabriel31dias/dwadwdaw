import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DadosBoletoFatura } from '../../models/billet-data.model';

@Component({
  selector: 'app-stage-billet-data',
  templateUrl: './stage-billet-data.component.html',
  styleUrls: ['./stage-billet-data.component.scss']
})
export class StageBilletDataComponent {

  @Input() billetData: DadosBoletoFatura = <DadosBoletoFatura>{};
  @Input() disableFields: boolean = false;

  constructor(private translate: TranslateService) {
    translate.use('pt-br')
  }

}
