import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: false,
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css'
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = 'info';
  @Input() color: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray' = 'gray';
  @Input() subtitle?: string;

  getIconColorClass(): string {
    const colorMap = {
      green: 'text-green-500',
      blue: 'text-blue-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500',
      purple: 'text-purple-500',
      gray: 'text-gray-500'
    };
    return colorMap[this.color];
  }

  getBgColorClass(): string {
    const colorMap = {
      green: 'bg-green-50',
      blue: 'bg-blue-50',
      yellow: 'bg-yellow-50',
      red: 'bg-red-50',
      purple: 'bg-purple-50',
      gray: 'bg-gray-50'
    };
    return colorMap[this.color];
  }
}
