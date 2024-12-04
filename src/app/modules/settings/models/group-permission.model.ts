export interface GrupoPermissao {
  nome: string;
  usuarios: string[];
  permissoes: SetPermissionGroup[];
}

export interface SetPermissionGroup {
  idPermissoesModulo: number,
  habilitado: boolean,
}
