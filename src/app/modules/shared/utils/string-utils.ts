/**Indica se uma string especificada é nula, vazia ou consiste apenas de caracteres de espaço em branco. */
export function isNullOrWhitespace(input: any) : boolean {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}