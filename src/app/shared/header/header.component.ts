import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslationService, Lang } from '../../services/translation.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  navOpen = false;
  dark = false;
  currentLang: Lang = 'ka';
  languages = this.tr.languages;
  private subs: Subscription[] = [];

  constructor(
    public router: Router,
    public tr: TranslationService,
    public theme: ThemeService
  ) {}

  ngOnInit() {
    this.dark = this.theme.isDark;
    this.currentLang = this.tr.currentLang;
    this.subs.push(
      this.theme.dark$.subscribe(d => this.dark = d),
      this.tr.lang$.subscribe(l => this.currentLang = l)
    );
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  toggleNav() { this.navOpen = !this.navOpen; }
  closeNav() { this.navOpen = false; }
  toggleTheme() { this.theme.toggle(); }
  onLangChange(lang: Lang) { this.tr.setLang(lang); this.closeNav(); }
  t(key: string) { return this.tr.t(key); }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.closeNav();
    this.router.navigate(['/auth']);
  }
}
