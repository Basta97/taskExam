import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../libs/auth/services/auth.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { ToastComponent } from '../../../../shared/components/toast/toast';
import {
  ChangePasswordRequest,
  RequestEmailChangeRequest,
  ConfirmEmailChangeRequest,
  DeleteAccountRequest,
} from '../../../../shared/models/account.models';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastComponent],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettingsComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly uploadService = inject(UploadService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly tabs = [
    { key: 'profile' as const, label: 'Profile' },
    { key: 'change-password' as const, label: 'Change Password' },
  ];

  activeTab = signal<'profile' | 'change-email' | 'change-password' | 'delete-account'>('profile');

  setTab(key: 'profile' | 'change-email' | 'change-password' | 'delete-account') {
    this.activeTab.set(key);
  }

  toastMessage = signal('');
  toastType = signal<'success' | 'error' | 'info'>('info');
  toastVisible = signal(false);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  emailForm: FormGroup;
  otpForm: FormGroup;
  deleteForm: FormGroup;

  loading = false;
  emailStep: 'request' | 'confirm' = 'request';

  avatarPreview: string | null = null;
  avatarUploading = false;

  constructor() {
    const user = this.authService.currentUser();
    this.profileForm = this.fb.group({
      firstName: [user?.firstName || '', [Validators.required]],
      lastName: [user?.lastName || '', [Validators.required]],
      username: [user?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [{ value: user?.email || '', disabled: true }],
      phone: [user?.phone || '', [Validators.pattern(/^[0-9]{8,15}$/)]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );

    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.deleteForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  get currentAvatar(): string {
    return this.avatarPreview || this.authService.currentUser()?.avatar || '';
  }

  get userInitial(): string {
    const user = this.authService.currentUser();
    return user ? user.firstName.charAt(0).toUpperCase() : 'U';
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 4000);
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Image must be under 5MB', 'error');
      return;
    }

    this.avatarPreview = URL.createObjectURL(file);
    this.avatarUploading = true;

    this.uploadService.upload(file).subscribe({
      next: (res: any) => {
        this.avatarUploading = false;
        const url = res?.payload?.url || res?.url || res?.data?.url;
        if (url) {
          this.userService.updateProfile({ avatar: url } as any).subscribe({
            next: (profileRes: any) => {
              const updatedUser = profileRes?.payload?.user || profileRes?.user;
              if (updatedUser) {
                this.authService['_currentUser'].set(updatedUser);
              }
              this.showToast('Profile photo updated', 'success');
            },
            error: () => {
              this.showToast('Photo uploaded but failed to save profile', 'error');
            },
          });
        } else {
          this.showToast('Upload succeeded but no URL returned', 'error');
        }
      },
      error: (err: any) => {
        this.avatarUploading = false;
        this.avatarPreview = null;
        this.showToast(err.error?.message || 'Failed to upload photo', 'error');
      },
    });
  }

  onProfileSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        const updatedUser = res?.payload?.user || res?.user;
        if (updatedUser) {
          this.authService['_currentUser'].set(updatedUser);
        }
        this.showToast('Profile updated successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to update profile', 'error');
      },
    });
  }

  onRequestEmailChange() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.userService.requestEmailChange(this.emailForm.value as RequestEmailChangeRequest).subscribe({
      next: () => {
        this.loading = false;
        this.emailStep = 'confirm';
        this.showToast('Verification code sent to your new email', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to request email change', 'error');
      },
    });
  }

  onConfirmEmailChange() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload: ConfirmEmailChangeRequest = {
      newEmail: this.emailForm.value.newEmail,
      code: this.otpForm.value.code,
    };
    this.userService.confirmEmailChange(payload).subscribe({
      next: () => {
        this.loading = false;
        this.emailStep = 'request';
        this.emailForm.reset();
        this.otpForm.reset();
        this.showToast('Email changed successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to confirm email change', 'error');
      },
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.userService.changePassword(this.passwordForm.value as ChangePasswordRequest).subscribe({
      next: () => {
        this.loading = false;
        this.passwordForm.reset();
        this.showToast('Password changed successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to change password', 'error');
      },
    });
  }

  onDeleteAccount() {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    this.loading = true;
    this.userService.deleteAccount(this.deleteForm.value as DeleteAccountRequest).subscribe({
      next: () => {
        this.loading = false;
        this.authService.logout();
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to delete account', 'error');
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!newPassword || !confirmPassword) return null;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
}
