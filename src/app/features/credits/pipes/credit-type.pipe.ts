import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditType',
  standalone: false
})
export class CreditTypePipe implements PipeTransform {
  private typeLabels: { [key: string]: string } = {
    'earned': 'Otorgado',
    'used': 'Usado',
    'expired': 'Expirado',
    'refunded': 'Reembolsado'
  };

  transform(value: string): string {
    return this.typeLabels[value] || value;
  }
}
