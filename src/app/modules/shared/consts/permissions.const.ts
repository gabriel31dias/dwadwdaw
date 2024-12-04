export class ConfiguracoesPermissoes {
  public static Visualizar: string = "Configuracoes_Read";
  public static Editar: string = "Configuracoes_Update";
}

export class ConferenciaPermissoes {
  public static Ler: string = "Conferencia_Read";
  public static Criar: string = "Conferencia_Create";
  public static Editar: string = "Conferencia_Update";
  public static Apagar: string = "Conferencia_Delete";
  public static Cancelar: string = "Conferencia_Cancelar";
  public static BaixaConferenciaEmDesacordo: string = "Conferencia_BaixaConferenciaEmDesacordo";
  public static VisualizarChaveVolume: string = "Conferencia_VisualizarChaveVolume";
  public static ExcluirVolumeNaoEncontrado: string = "Conferencia_ExcluirVolumeNaoEncontrado";
  public static VisualizarVolumesConferenciaCegas: string = "Conferencia_VisualizarVolumesConferenciaCegas";
  public static ImprimirEtiquetaApenasComCTeParaVolume: string = "Conferencia_ImprimirEtiquetaApenasComCTeParaVolume";
  public static ExcluirNotaFiscalNaoEncontrada: string = "Conferencia_ExcluirNotaFiscalNaoEncontrada";
}

export class ContasAReceberPermissoes {
  public static Visualizar: string = "ContasAReceber_Read";
  public static Incluir: string = "ContasAReceber_Create";
  public static Editar: string = "ContasAReceber_Update";
  public static Excluir: string = "ContasAReceber_Delete";
  public static Cancelar: string = "ContasAReceber_Cancelar";
  public static LancarMovimento: string = "ContasAReceber_LancarMovimento";
  public static Baixar: string = "ContasAReceber_Baixar";
  public static Estornar: string = "ContasAReceber_Estornar";
  public static AlterarValorCTe: string = "ContasAReceber_AlterarValorCTe";
}
