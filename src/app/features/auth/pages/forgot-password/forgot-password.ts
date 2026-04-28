import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../libs/auth/services/auth.service';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '../../../../libs/auth/models/auth.models';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  error = '';
  loading = false;
  isSent = false;
  emailSentTo = '';

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.forgotPassword(this.form.value as ForgotPasswordRequest).subscribe({
      next: (res: ForgotPasswordResponse) => {
        this.emailSentTo = this.form.value.email;
        this.isSent = true;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to send reset link';
        this.loading = false;
      },
    });
  }

  backToInput() {
    this.isSent = false;
  }
}
