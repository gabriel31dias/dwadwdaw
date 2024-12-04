import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], sortBy: string, reverse: boolean): any[] {
    if (!array || !sortBy) {
      return array;
    }

    const order = reverse ? -1 : 1;

    return array.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1 * order;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1 * order;
      }
      return 0;
    });
  }
}
