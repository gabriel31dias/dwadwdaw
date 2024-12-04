import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { Modules } from '../consts/list-modules.const';
import { KeyValue } from '../models/key-value.model';
import { StorageService } from '../../authentication/services/storage.service';
import { SendEmailMultiple, SendEmailSingle } from '../models/send-email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient,
    private storageService: StorageService
  ) { }

  getConfigSendEmail(companyId: string, module: Modules, params: KeyValue[]) {
    const body: Object = {
      modulo: module,
      parametros: params,
      remetente: this.storageService.getEmail()
    }

    return this.http.post<any>(
      `${this.API}Email/Config?empresaId=${companyId}`, body
    );
  }

  sendEmailSingle(companyId: string, body: SendEmailSingle) {
    return this.http.post<any>(
      `${this.API}Email/Individual?empresaId=${companyId}`, body
    );
  }

  sendEmailMultiple(companyId: string, body: SendEmailMultiple) {
    return this.http.post<any>(
      `${this.API}Email/Lote?empresaId=${companyId}`, body
    );
  }
}
