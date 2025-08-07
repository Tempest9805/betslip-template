import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = signal(this._loadInitial());
  readonly isDark = this._isDark.asReadonly();

  constructor() {

    this._applyClass(this._isDark());
  }

  toggle() {
    const next = !this._isDark();
    this._isDark.set(next);
    this._applyClass(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  private _loadInitial(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private _applyClass(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }
}  