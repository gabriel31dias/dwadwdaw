import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { CollectionService } from '../../services/collection.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { TotaisDaCarga } from '../../models/load-totals.model';
import { NotaFiscal } from 'src/app/modules/shared/models/nota-fiscal.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stage-load-totals',
  templateUrl: './stage-load-totals.component.html',
  styleUrls: ['./stage-load-totals.component.scss']
})
export class StageLoadTotalsComponent implements OnChanges {

  companyId: string;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  @Input() loadTotals: TotaisDaCarga = <TotaisDaCarga>{};
  @Output() loadTotalsEmitter = new EventEmitter<TotaisDaCarga>();
  @Input() alertRequired: boolean = false;
  @Input() readonly: boolean = false;
  @Output() nfsEmitter = new EventEmitter<NotaFiscal[]>();

  /** Construtor do componente
   * @param translate Serviço de tradução para gerenciar a tradução do aplicativo.
   * @param modalService Serviço de modal para gerenciar modais no aplicativo.
   * @param storageService Serviço responsável para buscar e inserir dados no Storage.
   * @param collectionService Serviço responsável para chamada de APIs de Coleta.
   */
  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private collectionService: CollectionService,
    private route: ActivatedRoute,
  ) {
    translate.use('pt-br')
    this.companyId = this.storageService.getCompanyId()!;
  }

  /** Responsável pela detecção de alterações de valores no componente.
   * @param changes Diretiva que contém as modificações do componente.
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.loadTotals.nfs) this.loadTotals.nfs = [];
    this.loadTotalsEmitter.emit(this.loadTotals)
  }

  /** Calcula os totais de diferentes propriedades das notas fiscais e armazena o resultado em 'loadTotals'. */
  calculateTotals() {
    const quantityVolumes: number = this.loadTotals.nfs.reduce((sum: number, nf: NotaFiscal) =>
      sum + (nf.nota.carga.quantidade_volumes ? nf.nota.carga.quantidade_volumes : 0), 0
    );
    const weight: number = this.loadTotals.nfs.reduce((sum: number, nf: NotaFiscal) =>
      sum + (nf.nota.carga.peso_liquido ? nf.nota.carga.peso_liquido : 0), 0
    );
    const grossWeight: number = this.loadTotals.nfs.reduce((sum: number, nf: NotaFiscal) =>
      sum + (nf.nota.carga.peso_bruto ? nf.nota.carga.peso_bruto : 0), 0
    );
    const m3: number = this.loadTotals.nfs.reduce((sum: number, nf: NotaFiscal) =>
      sum + (nf.nota.carga.metragem_cubica ? nf.nota.carga.metragem_cubica : 0), 0
    );
    const value: number = this.loadTotals.nfs.reduce((sum: number, nf: NotaFiscal) =>
      sum + (nf.nota.carga.valor_mercadoria ? nf.nota.carga.valor_mercadoria : 0), 0
    );

    this.loadTotals.qtdNotas = this.loadTotals.nfs.length;
    this.loadTotals.qtdVolumes = quantityVolumes;
    this.loadTotals.pesoLiquido = String(weight);
    this.loadTotals.pesoBruto = grossWeight;
    this.loadTotals.metragemCubica = m3;
    this.loadTotals.valorMercadoria = value;
  }

  /** Recebe notas fiscais, as armazena, atualiza os totais e emite um evento para notificar outros componentes sobre as notas fiscais atualizadas.
   * @param nfs Array de objetos do tipo `NotaFiscal` que representa as notas fiscais a serem processadas.
  */
  getNFs(nfs: NotaFiscal[]) {
    this.loadTotals.nfs = nfs;
    this.calculateTotals();
    this.nfsEmitter.emit(nfs);
  }
}
