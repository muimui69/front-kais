import { isPlatformBrowser } from '@angular/common';
import {
    Inject,
    Injectable,
    PLATFORM_ID,
    Renderer2,
    RendererFactory2,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private renderer: Renderer2;
    private themeLink: HTMLLinkElement | null = null;
    private isBrowser: boolean;

    private _isDarkTheme = new BehaviorSubject<boolean>(false);
    isDarkTheme$ = this._isDarkTheme.asObservable();

    constructor(
        rendererFactory: RendererFactory2,
        @Inject(PLATFORM_ID) platformId: object,
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.themeLink = this.createThemeLinkElement();
        }
    }

    setTheme(themeUrl: string): void {
        if (this.isBrowser && this.themeLink) {
            this.themeLink.href = themeUrl;

            const isDarkTheme = themeUrl.includes('pink-bluegrey') ||
                themeUrl.includes('purple-green');

            this.setDarkTheme(isDarkTheme);
        }
    }

    toggleTheme(): void {
        this.setDarkTheme(!this._isDarkTheme.value);
    }

    setDarkTheme(isDark: boolean): void {
        if (this.isBrowser) {
            const body = document.body;

            if (isDark) {
                body.classList.add('dark-theme');
                body.classList.remove('light-theme');
                body.classList.remove('mat-light-theme');
                body.classList.add('mat-dark-theme');

                if (this.themeLink) {
                    this.themeLink.href = 'pink-bluegrey.css';
                }
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                body.classList.add('mat-light-theme');
                body.classList.remove('mat-dark-theme');

                if (this.themeLink) {
                    this.themeLink.href = 'azure-blue.css';
                }
            }

            this._isDarkTheme.next(isDark);
        }
    }

    isDarkTheme(): boolean {
        return this._isDarkTheme.value;
    }

    private createThemeLinkElement(): HTMLLinkElement {
        const existingLink = document.getElementById('app-theme') as HTMLLinkElement;
        if (existingLink) {
            return existingLink;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.id = 'app-theme';
        document.head.appendChild(link);
        return link;
    }
}