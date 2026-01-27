import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear montos en BOB (Bolivianos)
 * 
 * Uso:
 * {{ 15000 | bobCurrency }}  →  "Bs 15.000"
 * {{ 1500000 | bobCurrency }}  →  "Bs 1.500.000"
 */
@Pipe({
  name: 'bobCurrency',
  standalone: false
})
export class BobCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'Bs 0';
    }

    const formatted = value.toLocaleString('es-BO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `Bs ${formatted}`;
  }
}
