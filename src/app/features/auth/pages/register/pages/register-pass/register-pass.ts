import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-pass.html',
  styleUrl: './register-pass.css',
})
export class RegisterPass {
  @Output() submitPassword = new EventEmitter<string>();

  form: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator('password', 'confirmpassword') });
  }

  get passwordCtrl() { return this.form.get('password'); }
  get confirmPasswordCtrl() { return this.form.get('confirmpassword'); }

  onSubmit() {
    if (this.form.valid) {
      this.submitPassword.emit(this.form.value.password);
    } else {
      this.form.markAllAsTouched();
    }
  }

  togglePasswordVisibility() { this.showPassword = !this.showPassword; }
  toggleConfirmPasswordVisibility() { this.showConfirmPassword = !this.showConfirmPassword; }

  private passwordsMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirmPassword = group.get(confirmPasswordKey)?.value;
      if (!password || !confirmPassword) return null;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
