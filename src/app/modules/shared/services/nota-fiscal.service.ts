import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { ParamsGrid } from '../models/params-grid.model';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {

  private readonly APIV2 = environment.baseURLV2;

  /** Construtor da classe `NotaFiscalService`.
   * @param httpClient Serviço responsável pelas requisições HTTP.
  */
  constructor(private httpClient: HttpClient) { }

  /** API `GET` de filtros para listagem de Motoristas (GRID).
   * @param companyId Id da empresa.
   * @returns Retorna os filtros para a listagem de Motoristas.
  */
  getFiltersGrid(companyId: string) {
    return this.httpClient.get<any>(
      `${this.APIV2}NotaFiscal/Filtros?empresa_id=${companyId}`
    );
  }

  /** API `POST` para o modal de busca de Notas fiscais (GRID).
   * @param companyId Id da empresa.
   * @param params Parâmetros de busca de Notas fiscais.
   * @returns Retorna uma lista de Notas fiscais de acordo com os Parâmetos de busca.
  */
  getGridSearchNF(companyId: string, params: ParamsGrid) {
    return this.httpClient.post<any>(
      `${this.APIV2}NotaFiscal/Grid?empresa_id=${companyId}`, params
    );
  }

}
