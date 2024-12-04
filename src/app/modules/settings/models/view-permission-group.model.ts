export interface PermissionGroup {
  grupo: string;
  usuariosGrupo: string[];
  moduloPermissao: ModuloPermission[];
}

export interface ModuloPermission {
  modulo: string;
  permissoes: string[];
}
