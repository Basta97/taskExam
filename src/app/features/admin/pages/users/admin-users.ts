import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../shared/services/admin.service';
import { ToastComponent } from '../../../../shared/components/toast/toast';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsersComponent {
  private readonly adminService = inject(AdminService);

  users = signal<User[]>([]);
  loading = false;
  deletingId: string | null = null;
  totalPages = 0;
  currentPage = 1;

  toastMessage = signal('');
  toastType = signal<'success' | 'error' | 'info'>('info');
  toastVisible = signal(false);

  constructor() {
    this.loadUsers();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 4000);
  }

  loadUsers(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    this.adminService.getUsers(page, 20).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.users.set(payload?.data || []);
        this.totalPages = payload?.metadata?.totalPages || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  confirmDelete(id: string) { this.deletingId = id; }
  cancelDelete() { this.deletingId = null; }

  onDelete() {
    if (!this.deletingId) return;
    this.loading = true;
    this.adminService.deleteUser(this.deletingId).subscribe({
      next: () => {
        this.loading = false;
        this.deletingId = null;
        this.loadUsers(this.currentPage);
        this.showToast('User deleted successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to delete user', 'error');
      },
    });
  }
}
