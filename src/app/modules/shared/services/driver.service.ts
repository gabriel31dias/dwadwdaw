import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { StatusDriver } from '../consts/status-driver.const';
import { ParamsAdvancedSearchGrid } from '../models/params-advanced-search-grid.model';
import { removeMaskCpfCnpj } from '../utils/cnpj-mask';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private readonly API = environment.baseURL;

  /** Construtor da classe `DriverService`.
   * @param httpClient Serviço responsável pelas requisições HTTP.
  */
  constructor(private httpClient: HttpClient) { }

  /** API `GET` de busca avançada de Motorista.
   * @param companyId Id da empresa.
   * @param search Campo de busca.
   * @returns Retorna uma lista de motoristas de acordo com o campo de busca.
  */
  advancedSearch(companyId: string, search: string) {
    return this.httpClient.get<any>(
      `${this.API}Motorista/BuscaAvancada?empresa_id=${companyId}&busca=${search}`,
    );
  }

  /** API `GET` para modificação de status do motorista.
   * @param companyId Id da empresa.
   * @param status String do tipo `StatusDriver`.
   * @param cpf CPF do motorista a ser ativado.
   * @returns Retorna uma lista de motoristas de acordo com o campo de busca.
  */
  setStatus(companyId: string, status: StatusDriver, cpf: string) {
    cpf = removeMaskCpfCnpj(cpf);
    return this.httpClient.get<any>(
      `${this.API}Motorista/DefinirStatus?empresa_id=${companyId}&status=${status}&cpf=${cpf}`,
    );
  }

  /** API `POST` de listagem de Motoristas (GRID).
   * @param companyId Id da empresa.
   * @param params Parâmetros de busca de Motorista.
   * @returns Retorna uma lista de motoristas de acordo com os Parâmetos de busca.
  */
  getGrid(companyId: string, params: ParamsAdvancedSearchGrid) {
    return this.httpClient.post<any>(
      `${this.API}Motorista/Grid?empresa_id=${companyId}`, params
    );
  }

  /** API `GET` de filtros para listagem de Motoristas (GRID).
   * @param companyId Id da empresa.
   * @returns Retorna os filtros para a listagem de Motoristas.
  */
  getFiltersGrid(companyId: string) {
    return this.httpClient.get<any>(
      `${this.API}Motorista/Filtros?empresa_id=${companyId}`
    );
  }

  /** API `POST` de criação/edição de Motorista.
   * @param companyId Id da empresa.
   * @param driver Dados do motorista.
   * @returns Retorna o objeto de Motorista criado/editado.
  */
  upsertDriver(companyId: string, driver: Driver) {
    return this.httpClient.post<any>(
      `${this.API}Motorista?empresa_id=${companyId}`, driver
    );
  }

  /** API `GET` de busca de Detalhes do Motorista.
   * @param companyId Id da empresa.
   * @param cpf CPF do Motorista.
   * @returns Retorna o objeto de detalhes do Motorista.
  */
  getDetailsDriver(companyId: string, cpf: string) {
    return this.httpClient.get<any>(
      `${this.API}Motorista/Detalhes?empresa_id=${companyId}&cpf=${cpf}`
    );
  }


}
