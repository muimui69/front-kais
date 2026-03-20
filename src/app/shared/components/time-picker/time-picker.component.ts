import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'; // <-- Importamos MAT_DATE_LOCALE

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ],
  template: `
    <mat-form-field class="w-full" >
      <mat-label>{{ label }}</mat-label>
      <input matInput [matTimepicker]="picker" [(ngModel)]="value" (ngModelChange)="onChange($event)">
      <mat-timepicker-toggle matIconSuffix [for]="picker"></mat-timepicker-toggle>
      <mat-timepicker #picker></mat-timepicker>
    </mat-form-field>
  `
})
export class TimePickerComponent implements ControlValueAccessor {
  @Input() label = 'Selecciona una hora';

  value: Date | null = null;

  onChange: (value: Date | null) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: Date | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}