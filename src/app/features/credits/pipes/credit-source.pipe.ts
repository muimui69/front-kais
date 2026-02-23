import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditSource',
  standalone: false
})
export class CreditSourcePipe implements PipeTransform {
  private sourceLabels: { [key: string]: string } = {
    'referral': 'Referido',
    'admin': 'Administrador',
    'promotion': 'Promoción',
    'refund': 'Reembolso'
  };

  transform(value: string): string {
    return this.sourceLabels[value] || value;
  }
}
