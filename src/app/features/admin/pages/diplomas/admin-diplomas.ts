import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ToastComponent } from '../../../../shared/components/toast/toast';
import { Diploma } from '../../../../shared/models/dashboard';
import { CreateDiplomaRequest, UpdateDiplomaRequest } from '../../../../shared/models/admin.models';

@Component({
  selector: 'app-admin-diplomas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './admin-diplomas.html',
  styleUrl: './admin-diplomas.css',
})
export class AdminDiplomasComponent {
  private readonly adminService = inject(AdminService);
  private readonly dashboardService = inject(DashboardService);
  private readonly fb = inject(FormBuilder);

  diplomas = signal<Diploma[]>([]);
  loading = false;
  showModal = false;
  editingId: string | null = null;
  deletingId: string | null = null;
  totalPages = 0;
  currentPage = 1;

  toastMessage = signal('');
  toastType = signal<'success' | 'error' | 'info'>('info');
  toastVisible = signal(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [''],
    });
    this.loadDiplomas();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 4000);
  }

  loadDiplomas(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    this.dashboardService.getDiplomas(page, 12).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.diplomas.set(payload?.data || []);
        this.totalPages = payload?.metadata?.totalPages || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  openCreate() {
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(diploma: Diploma) {
    this.editingId = diploma.id;
    this.form.patchValue({ title: diploma.title, description: diploma.description, image: diploma.image });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
    this.editingId = null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    if (this.editingId) {
      this.adminService.updateDiploma(this.editingId, this.form.value as UpdateDiplomaRequest).subscribe({
        next: () => {
          this.loading = false;
          this.closeModal();
          this.loadDiplomas(this.currentPage);
          this.showToast('Diploma updated successfully', 'success');
        },
        error: (err: any) => {
          this.loading = false;
          this.showToast(err.error?.message || 'Failed to update diploma', 'error');
        },
      });
    } else {
      this.adminService.createDiploma(this.form.value as CreateDiplomaRequest).subscribe({
        next: () => {
          this.loading = false;
          this.closeModal();
          this.loadDiplomas(this.currentPage);
          this.showToast('Diploma created successfully', 'success');
        },
        error: (err: any) => {
          this.loading = false;
          this.showToast(err.error?.message || 'Failed to create diploma', 'error');
        },
      });
    }
  }

  confirmDelete(id: string) {
    this.deletingId = id;
  }

  cancelDelete() {
    this.deletingId = null;
  }

  onDelete() {
    if (!this.deletingId) return;
    this.loading = true;
    this.adminService.deleteDiploma(this.deletingId).subscribe({
      next: () => {
        this.loading = false;
        this.deletingId = null;
        this.loadDiplomas(this.currentPage);
        this.showToast('Diploma deleted successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to delete diploma', 'error');
      },
    });
  }

  toggleImmutable(diploma: Diploma) {
    this.adminService.toggleDiplomaImmutable(diploma.id).subscribe({
      next: () => this.loadDiplomas(this.currentPage),
      error: (err: any) => this.showToast(err.error?.message || 'Failed to toggle', 'error'),
    });
  }
}
