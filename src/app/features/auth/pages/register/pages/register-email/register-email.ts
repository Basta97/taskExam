import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-email.html',
  styleUrl: './register-email.css',
})
export class RegisterEmail {
  @Output() submitEmail = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailCtrl() {
    return this.form.get('email');
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitEmail.emit(this.form.value.email);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
