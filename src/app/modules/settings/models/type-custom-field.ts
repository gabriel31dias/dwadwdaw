export class TypeCustomField {
  public static Texto: string = "Texto";
  public static TextoMultilinha: string = "Texto multilinha";
  public static CaixaSelecaoUnica: string = "Caixa de seleção única";
  public static CaixaSelecaoMultipla: string = "Caixa de seleção múltipla";
  public static ListaSuspensa: string = "Lista suspensa";
  public static Numerico: string = "Numérico";
  public static Decimal: string = "Decimal";
  public static Data: string = "Data";
  public static Hora: string = "Hora";
}

// Verifica se o tipo é do tipo de campo que recebe um array de itens.
export function typeWithItems(type: TypeCustomField): boolean {
  if (type === TypeCustomField.CaixaSelecaoUnica
    || type === TypeCustomField.CaixaSelecaoMultipla
    || type === TypeCustomField.ListaSuspensa
  ) {
    return true;
  } else {
    return false;
  }
}
