import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bolivianos',
  standalone: false
})
export class BolivianosPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'Bs 0.00';
    }

    const formatted = new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

    return `Bs ${formatted}`;
  }
}
