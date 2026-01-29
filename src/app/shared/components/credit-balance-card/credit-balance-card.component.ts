import { Component, Input } from '@angular/core';
import { CreditBalance } from '../../../features/credits/interfaces/credit.interface';

@Component({
  selector: 'app-credit-balance-card',
  standalone: false,
  templateUrl: './credit-balance-card.component.html',
  styleUrl: './credit-balance-card.component.css'
})
export class CreditBalanceCardComponent {
  @Input() balance: CreditBalance | null = null;
  @Input() showDetails: boolean = true;
  @Input() compact: boolean = false;

  formatCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
    // Reemplazar "BOB" por "Bs" para usar el símbolo local
    return formatted.replace('BOB', 'Bs');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
