import { Modules } from "../../shared/consts/list-modules.const";
import { SizeCustomField } from "./size-custom-field";

export interface UpsertExhibition {
  nome: string;
  modulo: Modules;
  habilitado: boolean;
  configuracaoExibicao: ConfigExhibition[];
}

export interface ConfigExhibition {
  idCampoPersonalizado: number;
  ordemExibicao: number;
  tamanhoExibicao: SizeCustomField;
}
