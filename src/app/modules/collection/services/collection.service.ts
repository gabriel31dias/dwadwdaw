import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { Coleta } from '../models/collection.model';
import { ParamsListGrid } from '../../shared/models/params-list-grid.model';
import { NotaFiscal, NotaFiscalGrid } from '../../shared/models/nota-fiscal.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getTotalizers(companyId: string) {
    return this.http.get<any>(
      `${this.API}Coleta/ColetaIndicativos?empresaId=${companyId}`,
    );
  }

  getCollections(body: ParamsListGrid, companyId: string) {
    return this.http.post<any>(`${this.API}Coleta/Grid?empresaId=${companyId}`, body);
  }

  getColumnsCollections(companyId: string) {
    return this.http.get<any>(
      `${this.API}Coleta/Filtros?empresaId=${companyId}`,
    );
  }

  deleteCollection(companyId: string, coletas: any[]) {
    return this.http.post<any>(
      `${this.API}Coleta/Excluir?empresaId=${companyId}`, coletas
    );
  }

  cancelCollection(companyId: string, body: { motivo: string, coletas: any[] }) {
    return this.http.post<any>(
      `${this.API}Coleta/Cancelar?empresaId=${companyId}`, body
    );
  }

  downloadCollection(companyId: string, body: { Coletas: any[], DataBaixa: string, HoraColeta: string, TimeZone: number }) {
    return this.http.post<any>(
      `${this.API}Coleta/Baixa?empresaId=${companyId}`, body
    );
  }

  aceptCollection(companyId: string, cdCollection: string, cdFilEmp: string) {
    return this.http.get<any>(
      `${this.API}Coleta/Aceitar?empresaId=${companyId}&cdcoleta=${cdCollection}&cdfilemp=${cdFilEmp}`
    );
  }

  rejectCollection(companyId: string, cdCollection: string, cdFilEmp: string, reason: string) {
    return this.http.get<any>(
      `${this.API}Coleta/Rejeitar?empresaId=${companyId}&cdcoleta=${cdCollection}&cdfilemp=${cdFilEmp}&motivo=${reason}`
    );
  }

  getHistoricCollection(companyId: string, cdCollection: string | null, cdFilEmp: string | null) {
    return this.http.get<any>(
      `${this.API}Coleta/HistoricoAlteracoes?empresaId=${companyId}&cdcoleta=${cdCollection}&cdfilemp=${cdFilEmp}`
    );
  }

  getCollectionHistoryDetails(companyId: string, cdCollection: string | null, cdFilEmp: string | null, historicoId: string | null) {
    return this.http.get<any>(
      `${this.API}Coleta/HistoricoAlteracoesDetalhes?empresaId=${companyId}&cdcoleta=${cdCollection}&cdFilEmp=${cdFilEmp}&historicoId=${historicoId}`
    );
  }

  getNf(companyId: string, key: string) {
    return this.http.get<any>(
      `${this.API}NotaFiscal/ChaveAcessoOuCodigoColeta?empresaId=${companyId}&chaveAcesso=${key}`
    );
  }

  getClients(companyId: string, search: string) {
    return this.http.get<any>(
      `${this.API}Cliente?empresaId=${companyId}&cpfCnpj=${search}`,
    );
  }

  getTypeVehicle(companyId: string, search: string) {
    return this.http.get<any>(
      `${this.API}Motorista/TiposVeiculos?empresaId=${companyId}&search=${search}`,
    );
  }

  createCollection(companyId: string, collection: Coleta) {
    return this.http.post<any>(
      `${this.API}Coleta/Criar?empresaId=${companyId}`, collection
    );
  }

  updateCollection(companyId: string, cdColeta: string, cdFilEmp: string, collection: Coleta) {
    return this.http.post<any>(
      `${this.API}Coleta/Criar?empresaId=${companyId}&cdcoleta=${cdColeta}&cdFilEmp=${cdFilEmp}`, collection
    );
  }

  getDetailsCollection(companyId: string, number: string, cdFilEmp: string) {
    return this.http.get<any>(
      `${this.API}Coleta/Detalhes?empresaId=${companyId}&cdcoleta=${number}&cdFilEmp=${cdFilEmp}`,
    );
  }

  sendEmailCollection(companyId: string, cdCollections: string[]) {
    return this.http.post<any>(
      `${this.API}Coleta/EnviarPorEmail?empresaId=${companyId}`, { ids: cdCollections}
    );
  }

  getBase64Report(companyId: string, idsCollection: string[], cdReport: number | null) {
    let url: string = `${this.API}Coleta/RelatorioBase64?empresa_id=${companyId}`;
    if (cdReport !== null) url = `${url}&codigo_relatorio=${cdReport}`;
    return this.http.post<any>(url, idsCollection);
  }

  getUrlToSendRelatoryWpp(companyId: string, idsCollection: string[], cdReport: number | null) {
    let url: string = `${this.API}Coleta/RelatorioUrl?empresa_id=${companyId}`;
    if (cdReport !== null) url = `${url}&codigo_relatorio=${cdReport}`;
    return this.http.post<any>(url, { ids: idsCollection });
  }

  getVehicleLicensePlate(companyId: string, search: string) {
    return this.http.get<any>(
      `${this.API}Motorista/PlacaVeiculo?empresaId=${companyId}&search=${search}`,
    );
  }

  getTypesService(companyId: string) {
    return this.http.get<any>(
      `${this.API}Coleta/TiposServico?empresaId=${companyId}`,
    );
  }

  exportExcel(body: ParamsListGrid, companyId: string) {
    const httpOptions = { responseType: 'blob' as 'json' };
    return this.http.post<Blob>(`${this.API}Coleta/Excel?empresaId=${companyId}`, body, httpOptions);
  }

  /** Salva as notas fiscais associadas a uma coleta.
   * @param companyId O ID da empresa para a qual as notas fiscais estão sendo salvas.
   * @param cdColeta O código da coleta associada às notas fiscais.
   * @param cdFilEmp O código da filial da empresa da coleta.
   * @param nfs Um array de objetos NotaFiscal que contém as notas fiscais a serem salvas.
   * @returns Um Observable que emite a resposta da requisição HTTP para salvar as notas fiscais.
   */
  saveNotaFiscal(companyId: string, cdColeta: string, cdFilEmp: string, nfs: NotaFiscal[]) {
    return this.http.post<any>(`${this.API}Coleta/SalvarNotaFiscal?empresa_id=${companyId}&codigo_coleta=${cdColeta}&codigo_filial=${cdFilEmp}`, nfs
    );
  }

}
