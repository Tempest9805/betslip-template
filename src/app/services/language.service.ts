import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly storageKey = 'userLang';
  
  availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    const savedLang = localStorage.getItem(this.storageKey);
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = 'en';
    
    const langToUse = savedLang || (browserLang && this.isSupported(browserLang) ? browserLang : defaultLang);
    
    this.translate.setFallbackLang(defaultLang);
    this.translate.use(langToUse);
  }

  get currentLanguage(): string {
    return this.translate.currentLang;
  }

  setLanguage(lang: string): void {
    if (this.isSupported(lang)) {
      this.translate.use(lang);
      localStorage.setItem(this.storageKey, lang);
    }
  }

  private isSupported(lang: string): boolean {
    return this.availableLanguages.some(l => l.code === lang);
  }
}