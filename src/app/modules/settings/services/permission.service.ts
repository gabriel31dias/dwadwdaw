import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { SetPermissionGroup } from '../models/group-permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getGroups(companyId: string, nameGroup: string) {
    return this.http.get<any>(
      `${this.API}GrupoPermissoes/ByNome?empresaId=${companyId}&nome=${nameGroup}`,
    );
  }

  getDetailsGroup(groupId: number, companyId: string) {
    return this.http.get<any>(
      `${this.API}GrupoPermissoes/${groupId}?empresaId=${companyId}`,
    );
  }

  getPermissions(companyId: string) {
    return this.http.get<any>(
      `${this.API}Permissao/OpcoesNovoGrupo?empresaId=${companyId}`,
    );
  }

  getUsers(companyId: string, search: string) {
    return this.http.get<any>(
      `${this.API}UsuarioGrupoPermissoes/ListarUsuarios?empresaId=${companyId}&busca=${search}`,
    );
  }

  createGroup(companyId: string, nameGroup: string) {
    return this.http.post<any>(
      `${this.API}GrupoPermissoes?empresaId=${companyId}`, {
        nome: nameGroup
       }
    );
  }

  setPermissionsGroup(companyId: string, body: { idGrupoPermissoes: number, permissoes: SetPermissionGroup[] }) {
    return this.http.post<any>(
      `${this.API}Permissao/RedefinirGrupo?empresaId=${companyId}`, body
    );
  }

  setUsersGroup(companyId: string, body: { idGrupoPermissoes: number, logins: string[] }) {
    return this.http.post<any>(
      `${this.API}UsuarioGrupoPermissoes/Adicionar?empresaId=${companyId}`, body
    );
  }

  getPermissionsByGroup(companyId: string, groupId: number) {
    return this.http.get<any>(
      `${this.API}Permissao/ByGrupoPermissoes?empresaId=${companyId}&idGrupoPermissoes=${groupId}`,
    );
  }

  getUsersByGroup(companyId: string, groupId: number) {
    return this.http.get<any>(
      `${this.API}UsuarioGrupoPermissoes/ByGrupoPermissoes?empresaId=${companyId}&idGrupoPermissoes=${groupId}`,
    );
  }

  editGroup(companyId: string, groupId: number, nameGroup: string) {
    return this.http.put<any>(
      `${this.API}GrupoPermissoes/${groupId}?empresaId=${companyId}`, {
        nome: nameGroup
       }
    );
  }

  getPermissionsUser(companyId: string) {
    return this.http.get<any>(
      `${this.API}Permissao/ListarHabilitadas?empresaId=${companyId}`,
    );
  }

  deleteGroup(companyId: string, groupId: number) {
    return this.http.delete<any>(
      `${this.API}GrupoPermissoes/${groupId}?empresaId=${companyId}`,
    );
  }

  removeUsersGroup(companyId: string, body: { idGrupoPermissoes: number, logins: string[] }) {
    return this.http.post<any>(
      `${this.API}UsuarioGrupoPermissoes/Remover?empresaId=${companyId}`, body
    );
  }

}
