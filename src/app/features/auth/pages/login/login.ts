import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../libs/auth/services/auth.service';
import { LoginRequest } from '../../../../libs/auth/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  showPassword = false;
  showErrorBox = false;
  errMsg = 'Something went wrong';
  loading = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  closeErrorBox() {
    this.showErrorBox = false;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.showErrorBox = false;

    this.authService.login(this.form.value as LoginRequest).subscribe({
      next: (res: any) => {
        this.loading = false;
        const token = res?.token || res?.payload?.token || res?.accessToken;
        if (token) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errMsg = res?.message || 'Login failed';
          this.showErrorBox = true;
        }
      },
      error: (err: any) => {
        this.errMsg = err.error?.message || 'Invalid username or password';
        this.showErrorBox = true;
        this.loading = false;
      },
    });
  }
}
