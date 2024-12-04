import { Modules } from "../../shared/consts/list-modules.const";
import { SizeCustomField } from "./size-custom-field";
import { TypeCustomField } from "./type-custom-field";

export interface Exibicao {
  codigo?: number | null;
  nome: string;
  modulo: Modules;
  habilitado: boolean;
  campos: CampoExibicao[];
}

export interface CampoExibicao {
  codigo: number;
  nome: string;
  textoAjuda: string;
  tipo: TypeCustomField;
  habilitado: boolean;
  itens: string[];
  tamanho: SizeCustomField;
  ordem: number;
  possuiRegistro?: boolean;
}

export interface DragDropExibicao {
  campo: CampoExibicao;
  indice: number;
}

