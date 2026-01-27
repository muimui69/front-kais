import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear montos en CLP (Pesos Chilenos)
 * 
 * Uso:
 * {{ 15000 | clpCurrency }}  →  "$15.000 CLP"
 * {{ 1500000 | clpCurrency }}  →  "$1.500.000 CLP"
 */
@Pipe({
  name: 'clpCurrency',
  standalone: false
})
export class ClpCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0 CLP';
    }

    const formatted = value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `$${formatted} CLP`;
  }
}
