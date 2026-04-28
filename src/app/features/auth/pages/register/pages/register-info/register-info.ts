import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-info.html',
  styleUrl: './register-info.css',
})
export class RegisterInfo {
  @Output() submitInfo = new EventEmitter<{ firstname: string; lastname: string; username: string; phone: string }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
    });
  }

  get firstNameCtrl() { return this.form.get('firstname'); }
  get lastNameCtrl() { return this.form.get('lastname'); }
  get usernameCtrl() { return this.form.get('username'); }
  get phoneCtrl() { return this.form.get('phone'); }

  onSubmit() {
    if (this.form.valid) {
      this.submitInfo.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
