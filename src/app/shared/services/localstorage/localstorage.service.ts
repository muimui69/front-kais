import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    getItem<T>(key: string): T | null {
        if (this.isLocalStorageAvailable()) {
            const item = localStorage.getItem(key);
            if (item) {
                try {
                    return JSON.parse(item) as T;
                } catch (error) {
                    console.error('Error al parsear el item de localStorage', error);
                    return null;
                }
            }
        }
        return null;
    }

    setItem<T>(key: string, value: T): void {
        if (this.isLocalStorageAvailable()) {
            try {
                const serializedValue = JSON.stringify(value);
                localStorage.setItem(key, serializedValue);
            } catch (error) {
                console.error('Error al serializar el objeto para localStorage', error);
            }
        }
    }

    removeItem(key: string): void {
        if (this.isLocalStorageAvailable()) {
            localStorage.removeItem(key);
        }
    }

    cleanLocalStorage() {
        if (this.isLocalStorageAvailable()) {
            localStorage.clear()
        }
    }

    private isLocalStorageAvailable(): boolean {
        return typeof window !== 'undefined' && !!window.localStorage;
    }
}
