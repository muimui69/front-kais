import { Injectable } from '@angular/core';
import { DecimalPipe, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class FormatService {
    private readonly decimalPipe: DecimalPipe;
    private readonly currencyPipe: CurrencyPipe;
    private readonly datePipe: DatePipe;
    private readonly percentPipe: PercentPipe;

    constructor() {
        this.decimalPipe = new DecimalPipe('es-ES');
        this.currencyPipe = new CurrencyPipe('es-ES');
        this.datePipe = new DatePipe('es-ES');
        this.percentPipe = new PercentPipe('es-ES');
    }

    number(value: number | null | undefined, digitsInfo: string = '1.0-0'): string {
        if (value === null || value === undefined) return '0';
        return this.decimalPipe.transform(value, digitsInfo) || '0';
    }

    /**
     * Formatea un número como moneda boliviana (Bs)
     * @param value - Valor numérico
     * @param digitsInfo - Formato de dígitos
     * @returns String formateado como "Bs 5.500,50"
     */
    currency(value: number | null | undefined, digitsInfo: string = '1.2-2'): string {
        if (value === null || value === undefined) return 'Bs 0,00';

        try {
            // Formatea el número con separadores de miles y decimales
            const formatted = this.decimalPipe.transform(value, digitsInfo, 'es-ES');
            return `Bs ${formatted}`;
        } catch (error) {
            console.error('Error formatting currency:', error);
            return `Bs ${value.toFixed(2)}`;
        }
    }

    /**
     * Formatea un número como moneda USD
     * @param value - Valor numérico
     * @param digitsInfo - Formato de dígitos
     * @returns String formateado como "$5,500.50"
     */
    currencyUSD(value: number | null | undefined, digitsInfo: string = '1.2-2'): string {
        if (value === null || value === undefined) return '$0.00';

        try {
            return this.currencyPipe.transform(value, 'USD', 'symbol', digitsInfo, 'es-ES') || '$0.00';
        } catch (error) {
            console.error('Error formatting USD currency:', error);
            return `$${value.toFixed(2)}`;
        }
    }

    /**
    * Formatea una fecha
    * @param value - Fecha como Date o string
    * @param format - Formato de fecha (dd/MM/yyyy, dd/MM/yyyy HH:mm, etc.)
    * @returns String formateado
    */
    date(value: Date | string | null | undefined, format: string = 'dd/MM/yyyy'): string {
        if (!value) return '-';

        try {
            const dateValue = typeof value === 'string' ? new Date(value) : value;

            if (isNaN(dateValue.getTime())) {
                console.error('Invalid date:', value);
                return '-';
            }

            const includesTime = format.includes('HH') || format.includes('mm');

            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                ...(includesTime && {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            };

            const formatted = new Intl.DateTimeFormat('es-ES', options).format(dateValue);
            return formatted.replace(',', '');

        } catch (error) {
            console.error('Error formatting date:', error);
            return '-';
        }
    }

    /**
     * Formatea un número como porcentaje
     * @param value - Valor numérico (95.75 = 95.75%)
     * @param digitsInfo - Formato de dígitos
     * @returns String formateado como "95,75%"
     */
    percent(value: number | null | undefined, digitsInfo: string = '1.2-2'): string {
        if (value === null || value === undefined) return '0%';

        try {
            const formatted = this.decimalPipe.transform(value, digitsInfo, 'es-ES');
            return `${formatted}%`;
        } catch (error) {
            console.error('Error formatting percent:', error);
            return `${value.toFixed(2)}%`;
        }
    }

    /**
     * Formatea un booleano como texto
     */
    boolean(value: boolean | null | undefined, trueLabel: string = 'Sí', falseLabel: string = 'No'): string {
        return value ? trueLabel : falseLabel;
    }

    /**
     * Trunca un texto largo
     */
    truncate(value: string | null | undefined, limit: number = 50): string {
        if (!value) return '-';
        return value.length > limit ? `${value.substring(0, limit)}...` : value;
    }
}