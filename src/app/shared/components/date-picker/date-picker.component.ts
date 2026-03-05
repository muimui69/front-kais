// components/date-picker/date-picker.component.ts
import { Component, forwardRef, Input, Optional, SkipSelf, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';

export const LUXON_DATE_FORMATS = {
    parse: {
        dateInput: 'DDD',
    },
    display: {
        dateInput: 'DDD',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'DDD',
        monthYearA11yLabel: 'MMMM yyyy',
    },
};

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule
    ],
    providers: [
        provideLuxonDateAdapter(LUXON_DATE_FORMATS),
        { provide: MAT_DATE_FORMATS, useValue: LUXON_DATE_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    template: `
        <mat-form-field class="w-full" >
            <mat-label>{{ label }}</mat-label>
            <input matInput 
                   [matDatepicker]="picker" 
                   [(ngModel)]="value"
                   (ngModelChange)="onChange($event)"
                   (blur)="onTouched()"
                   [disabled]="disabled"
                   [min]="min"
                   [max]="max">
            <mat-hint>{{ hint }}</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (errorMessage) {
                <mat-error>{{ errorMessage }}</mat-error>
            }
        </mat-form-field>
    `
})
export class DatePickerComponent implements ControlValueAccessor {
    @Input() label = 'Selecciona una fecha';
    @Input() hint = 'YYYY/MM/DD';
    @Input() min: DateTime | null = null;
    @Input() max: DateTime | null = null;
    @Input() errorMessage = '';

    value: DateTime | null = null;
    disabled = false;

    onChange: (value: DateTime | null) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(value: DateTime | null): void {
        this.value = value;
    }

    registerOnChange(fn: (value: DateTime | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}