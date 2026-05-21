import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RailwayService } from '../services/railway.service';
import { TranslationService } from '../services/translation.service';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  showRegister = false;

  // Password toggles
  showLoginPassword = false;
  showRegPassword = false;
  showConfirmPassword = false;

  // Login Models
  loginEmail = '';
  loginPassword = '';

  // Register Models
  regFirstName = ''; regLastName = '';
  regAge: number | null = null;
  regGender = 'MALE';
  regEmail = '';
  countryCode = '+995'; regPhone = '';
  regAddress = ''; regZipcode = '';
  regAvatar = '';
  regPassword = ''; confirmPassword = '';

  constructor(
    public router: Router,
    private railwayService: RailwayService,
    public tr: TranslationService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  t(key: string) { return this.tr.t(key); }
  isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  private showLoading() {
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }

  private async showAlert(icon: 'success' | 'error', title: string, text: string) {
    return Swal.fire({ icon, title, text, confirmButtonText: 'OK' });
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.showAlert('error', 'Error', 'Please fill in all fields');
      return;
    }
    if (!this.isValidEmail(this.loginEmail)) {
      this.showAlert('error', 'Error', 'Invalid email format');
      return;
    }

    this.showLoading();
    this.railwayService.login(this.loginEmail, this.loginPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (tokens: any) => {
          if (tokens?.access_token) localStorage.setItem('access_token', tokens.access_token);
          if (tokens?.refresh_token) localStorage.setItem('refresh_token', tokens.refresh_token);
          await this.showAlert('success', 'Success', 'Login successful!');
          this.router.navigate(['/']);
        },
        error: (e) => {
          this.showAlert('error', 'Login Failed', e?.error?.message || 'Check credentials');
        }
      });
  }

  onRegister() {
    const phone = `${this.countryCode}${this.regPhone}`.replace(/\s+/g, '');

    if (!this.regFirstName || !this.regLastName || !this.regEmail || !this.regPassword || !this.regAddress || !this.regZipcode || !this.regPhone) {
      this.showAlert('error', 'Error', 'Please fill in all required fields');
      return;
    }
    if (!this.regAge || this.regAge <= 0) {
      this.showAlert('error', 'Error', 'Please enter a valid age');
      return;
    }
    if (!this.isValidEmail(this.regEmail)) {
      this.showAlert('error', 'Error', 'Invalid email format');
      return;
    }
    if (this.regPassword !== this.confirmPassword) {
      this.showAlert('error', 'Error', 'Passwords do not match');
      return;
    }

    const seed = encodeURIComponent(`${this.regFirstName}-${this.regLastName}-${this.regEmail}`);
    const avatar = this.regAvatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;

    const payload = {
      firstName: this.regFirstName,
      lastName: this.regLastName,
      age: this.regAge,
      email: this.regEmail,
      password: this.regPassword,
      address: this.regAddress,
      phone,
      zipcode: this.regZipcode,
      avatar,
      gender: this.regGender
    };

    this.showLoading();
    this.railwayService.register(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.railwayService.sendVerificationEmail(this.regEmail).subscribe();
          this.showAlert('success', 'Registered!', 'Verification email sent. Please check your inbox.');
          this.showRegister = false;
          this.loginEmail = this.regEmail;
          this.loginPassword = '';
        },
        error: (e) => {
          this.showAlert('error', 'Registration Failed', e?.error?.message || 'Registration error');
        }
      });
  }
}