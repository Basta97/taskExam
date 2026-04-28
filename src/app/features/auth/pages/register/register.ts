import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../libs/auth/services/auth.service';
import { RegisterEmail } from './pages/register-email/register-email';
import { VerifyEmailStep } from './pages/verify-email/verify-email';
import { RegisterInfo } from './pages/register-info/register-info';
import { RegisterPass } from './pages/register-pass/register-pass';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterEmail, VerifyEmailStep, RegisterInfo, RegisterPass],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  step = 1;
  isSubmitting = false;
  showErrorBox = false;
  errorMessage = 'Something went wrong';

  userEmail = '';
  userInfo: { firstname: string; lastname: string; username: string; phone: string } | null = null;

  isStep(n: number): boolean {
    return this.step === n;
  }

  closeErrorBox(): void {
    this.showErrorBox = false;
    this.cdr.detectChanges();
  }

  onEmailSubmit(email: string) {
    this.userEmail = email;
    this.isSubmitting = true;
    this.showErrorBox = false;

    this.authService.sendEmailVerification({ email }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res?.status === false || res?.code >= 400) {
          this.errorMessage = res.message || 'Error occurred';
          this.showErrorBox = true;
          this.cdr.detectChanges();
          return;
        }
        this.step = 2;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to send verification email.';
        this.showErrorBox = true;
        this.cdr.detectChanges();
      },
    });
  }

  onOtpSubmit(code: string) {
    this.isSubmitting = true;
    this.showErrorBox = false;

    this.authService.confirmEmailVerification({ email: this.userEmail, code }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res?.status === false || res?.code >= 400) {
          this.errorMessage = res.message || 'Invalid code. Please try again.';
          this.showErrorBox = true;
          this.cdr.detectChanges();
          return;
        }
        this.step = 3;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || err.message || 'Invalid code. Please try again.';
        this.showErrorBox = true;
        this.cdr.detectChanges();
      },
    });
  }

  onEditEmail() {
    this.step = 1;
  }

  onInfoSubmit(info: { firstname: string; lastname: string; username: string; phone: string }) {
    this.userInfo = info;
    this.step = 4;
  }

  onPasswordSubmit(password: string) {
    this.isSubmitting = true;
    this.showErrorBox = false;

    const payload = {
      firstName: this.userInfo!.firstname,
      lastName: this.userInfo!.lastname,
      username: this.userInfo!.username,
      email: this.userEmail,
      phone: this.userInfo!.phone,
      password,
      confirmPassword: password,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        let msg = err.error?.message || err.message || 'Registration failed. Please try again.';
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          msg = err.error.errors.map((e: any) => e.message).join(' | ');
        }
        this.errorMessage = msg;
        this.showErrorBox = true;
        this.cdr.detectChanges();
      },
    });
  }
}
