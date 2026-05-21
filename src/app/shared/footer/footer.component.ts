import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <p>©2023 <span class="brand">Step Railway</span>. {{ tr.t('footerRights') }}</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      width: 100%;
      background: #f4f5fc;
      border-top: 1px solid #e0e4f0;
      padding: 28px 8%;
      transition: background 0.3s, border-color 0.3s;
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .footer-inner p {
      font-size: 14px;
      color: #888;
    }
    .brand { color: #2b41bd; font-weight: 600; }

    :host-context(body.dark-mode) .site-footer {
      background: #12121f;
      border-top-color: #2d2d4e;
    }
    :host-context(body.dark-mode) .footer-inner p { color: #666; }
    :host-context(body.dark-mode) .brand { color: #6c82f5; }
  `]
})
export class FooterComponent {
  constructor(public tr: TranslationService) {}
}
