import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'dark'
  );
  dark$ = this.darkSubject.asObservable();

  get isDark(): boolean { return this.darkSubject.value; }

  init() {
    document.body.classList.toggle('dark-mode', this.isDark);
  }

  toggle() {
    const next = !this.isDark;
    this.darkSubject.next(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', next);
  }
}
