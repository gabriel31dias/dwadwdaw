import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root',
})
export class CustomDateAdapter extends NativeDateAdapter {
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb' ];
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
    } else if (style === 'short') {
      return [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ];
    } else if (style === 'narrow') {
      return [
        'J', 'F', 'M', 'A', 'M', 'J',
        'J', 'A', 'S', 'O', 'N', 'D'
      ];
    }
    return super.getMonthNames(style);
  }
}
