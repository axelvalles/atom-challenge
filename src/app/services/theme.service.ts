import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme: 'dark' | 'light' = 'light';

  constructor() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme.matches) {
      this.theme = 'dark';
      document.body.dataset['theme'] = 'dark';
      document.body.classList.add('dark');
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset['theme'] = this.theme;
    document.body.classList.toggle('dark');
  }
}
