import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailStep {
  @Input() email = '';
  @Output() submitOtp = new EventEmitter<string>();
  @Output() editEmail = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
      code6: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  onInput(event: any, nextInputId: string | null) {
    const input = event.target;
    if (input.value && nextInputId) {
      document.getElementById(nextInputId)?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, prevInputId: string | null, controlName: string) {
    if (event.key === 'Backspace' && !this.form.get(controlName)?.value && prevInputId) {
      document.getElementById(prevInputId)?.focus();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const v = this.form.value;
      this.submitOtp.emit(`${v.code1}${v.code2}${v.code3}${v.code4}${v.code5}${v.code6}`);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onEdit() {
    this.editEmail.emit();
  }
}
