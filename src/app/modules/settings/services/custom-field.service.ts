import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { CustomField } from '../models/custom-field.model';
import { RequestFilterColumn } from '../../shared/models/filter-column.model';
import { UpsertExhibition } from '../models/upsert-exhibition.model';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  createCustomField(companyId: string, field: CustomField) {
    return this.http.post<any>(
      `${this.API}CamposPersonalizados?empresaId=${companyId}`, field
    );
  }

  getDetailsCustomField(companyId: string, fieldId: number) {
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/${fieldId}?empresaId=${companyId}`
    );
  }

  editCustomField(companyId: string, field: CustomField) {
    return this.http.put<any>(
      `${this.API}CamposPersonalizados/${field.codigo}?empresaId=${companyId}`, field
    );
  }

  getCustomFields(companyId: string, search: string, filters: RequestFilterColumn[]) {
    return this.http.post<any>(
      `${this.API}CamposPersonalizados/Grid?empresaId=${companyId}`, {
      filtros: filters,
      search: search
    }
    );
  }

  getColumnsFilter(companyId: string) {
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/Filtros?empresaId=${companyId}`
    );
  }

  deleteField(companyId: string, fieldId: number) {
    return this.http.delete<any>(
      `${this.API}CamposPersonalizados/${fieldId}?empresaId=${companyId}`,
    );
  }

  changeStatus(companyId: string, ids: number[], action: 'Habilitar' | 'Desabilitar') {
    switch (action) {
      case 'Habilitar':
        return this.http.post<any>(
          `${this.API}CamposPersonalizados/Habilitar?empresaId=${companyId}`, { ids }
        );

      case 'Desabilitar':
        return this.http.post<any>(
          `${this.API}CamposPersonalizados/Desabilitar?empresaId=${companyId}`, { ids }
        );
    }
  }

  disableField(companyId: string, fieldId: number) {
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/Desabilitar/${fieldId}?empresaId=${companyId}`,
    );
  }


  getDisplayFields(companyId: string, module: string) {
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/ExibicaoCamposPersonalizados/${module}?empresaId=${companyId}`,
    );
  }

  getGridExibition(companyId: string, search: string, filters: RequestFilterColumn[]) {
    return this.http.post<any>(
    `${this.API}CamposPersonalizados/GridExibicao?empresaId=${companyId}`, {
      filtros: filters,
      search: search
    }
    );
  }

  getEhxibitionFilters(companyId: string){
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/FiltrosExibicao?empresaId=${companyId}`
    );
  }

  deleteExhibition(companyId: string, exhibitionId: number) {
    return this.http.delete<any>(
      `${this.API}CamposPersonalizados/Exibicao/${exhibitionId}?empresaId=${companyId}`,
    );
  }

  changeStatusExhibition(companyId: string, ids: number[], action: 'Habilitar' | 'Desabilitar') {
    switch (action) {
      case 'Habilitar':
        return this.http.post<any>(
          `${this.API}CamposPersonalizados/Exibicao/Habilitar?empresaId=${companyId}`, { ids }
        );

      case 'Desabilitar':
        return this.http.post<any>(
          `${this.API}CamposPersonalizados/Exibicao/Desabilitar?empresaId=${companyId}`, { ids }
        );
    }
  }

  getAllFieldsEnabled(companyId: string) {
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/GetAllCamposHabilitados?empresaId=${companyId}`
    );
  }

  createExhibition(companyId: string, request: UpsertExhibition) {
    return this.http.post<any>(
      `${this.API}CamposPersonalizados/Exibicao?empresaId=${companyId}`, request
    );
  }

  getDetailsExhibition(companyId: string, exhibitionId: number) {
    return this.http.get<any>(
      `${this.API}CamposPersonalizados/ExibicaoById/${exhibitionId}?empresaId=${companyId}`
    );
  }

  updateExhibition(companyId: string, exhibitionId: number, request: UpsertExhibition) {
    return this.http.put<any>(
      `${this.API}CamposPersonalizados/Exibicao/${exhibitionId}?empresaId=${companyId}`, request
    );
  }
}
