import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomField } from '../models/custom-field.model';
import { Exibicao } from '../models/exhibition.model';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionsService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getExhibition(codigo: number): Observable<Exibicao>{
    return this.http.get<Exibicao>(`${this.API}`)
  }

}
