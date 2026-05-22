/**
 * Standalone `/auth/verify-email` page: send code and confirm OTP outside the register wizard.
 */
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../libs/auth/services/auth.service';
import {
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  ConfirmEmailVerificationRequest,
  ConfirmEmailVerificationResponse,
} from '../../../../libs/auth/models/auth.models';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm!: FormGroup;
  step: 'send' | 'confirm' = 'send';
  error = '';
  loading = false;
  success = '';
  timer = 60;
  canResend = false;

  ngOnInit() {
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        new Array(6).fill('').map(() => ['', [Validators.required, Validators.maxLength(1), Validators.pattern('^[0-9]$')]])
      ),
    });
  }

  get otpArray() {
    return this.otpForm.get('otp') as FormArray;
  }

  startTimer() {
    this.timer = 60;
    this.canResend = false;
    const interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.canResend = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  onInputChange(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    if (value && index < 5) {
      const nextInput = input.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: any, index: number) {
    if (event.key === 'Backspace' && !this.otpArray.at(index).value && index > 0) {
      const prevInput = event.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) prevInput.focus();
    }
  }

  sendVerification(): void {
    if (this.emailForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.sendEmailVerification(this.emailForm.value as SendEmailVerificationRequest).subscribe({
      next: (res: SendEmailVerificationResponse) => {
        this.success = res.message;
        this.step = 'confirm';
        this.loading = false;
        this.startTimer();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to send verification';
        this.loading = false;
      },
    });
  }

  confirmVerification(): void {
    if (this.otpForm.invalid) return;
    this.loading = true;
    this.error = '';
    const code = this.otpForm.value.otp.join('');
    const email = this.emailForm.value.email;
    this.authService.confirmEmailVerification({ email, code } as ConfirmEmailVerificationRequest).subscribe({
      next: (res: ConfirmEmailVerificationResponse) => {
        this.success = res.message;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Verification failed';
        this.loading = false;
      },
    });
  }

  resendCode() {
    if (this.canResend) {
      this.sendVerification();
    }
  }
}
