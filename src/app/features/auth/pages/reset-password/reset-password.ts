import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../libs/auth/services/auth.service';
import { ResetPasswordRequest } from '../../../../libs/auth/models/auth.models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  token = this.route.snapshot.queryParamMap.get('token') || '';

  readonly form: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatch }
  );

  showPassword = false;
  showConfirmPassword = false;
  error = '';
  loading = false;
  success = false;

  get passwordCtrl() { return this.form.get('newPassword'); }
  get confirmPasswordCtrl() { return this.form.get('confirmPassword'); }

  togglePasswordVisibility() { this.showPassword = !this.showPassword; }
  toggleConfirmPasswordVisibility() { this.showConfirmPassword = !this.showConfirmPassword; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.token) {
      this.error = 'Invalid or missing reset token. Please request a new password reset link.';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.form.value.newPassword,
      confirmPassword: this.form.value.confirmPassword,
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Password reset failed. The token may have expired.';
      },
    });
  }

  private passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  }
}
