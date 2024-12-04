/** Função que remove itens duplicados de um array.
 * @param {T[]} array - O array que será filtrado.
 * @param {K} [key] - (Opcional) A chave de propriedade do objeto que será usada para remover duplicatas.
 * @returns {T[]} Um novo array sem valores duplicados. Se uma `key` for fornecida, os objetos com valores duplicados na chave específica serão removidos. Caso contrário, removerá duplicações do array como um todo.
*/
export function filterNoRepeatArray<T, K extends keyof T>(array: T[], key?: K): T[] {
  if (key) {
    const set = new Set<T[K]>();
    const resultado: T[] = [];

    for (const item of array) {
      const chave = item[key];
      if (!set.has(chave)) {
        set.add(chave);
        resultado.push(item);
      }
    }

    return resultado;
  } else {
    return [...new Set(array)];
  }
}

/** Realiza a comparação de 2 arrays e retorna registros que tem diferença de um para o outro.
  * @param array1 Array 1 para comparação.
  * @param array2 Array 2 para comparação.
  * @returns Retorna uma listagem de valores que estão presentes no Array 1 e não estão presentes no Array 2.
*/
export function compareArrays(array1: string[], array2: string[]) {
  const diferentIndex: string[] = [];

  array1.forEach((element) => {
    if (!array2.includes(element)) {
      diferentIndex.push(element)
    }
  })

  return diferentIndex ? diferentIndex : [];
}
