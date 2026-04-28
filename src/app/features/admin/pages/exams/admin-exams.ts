import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ToastComponent } from '../../../../shared/components/toast/toast';
import { Exam, Diploma } from '../../../../shared/models/dashboard';
import { CreateExamRequest, UpdateExamRequest } from '../../../../shared/models/admin.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-exams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './admin-exams.html',
  styleUrl: './admin-exams.css',
})
export class AdminExamsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly dashboardService = inject(DashboardService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  exams = signal<Exam[]>([]);
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
      duration: [60, [Validators.required, Validators.min(1)]],
      diplomaId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadDiplomas();
    this.loadExams();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 4000);
  }

  loadDiplomas() {
    this.dashboardService.getDiplomas(1, 100).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.diplomas.set(payload?.data || []);
      },
    });
  }

  loadExams(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    this.dashboardService.getExams(page, 12).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.exams.set(payload?.data || []);
        this.totalPages = payload?.metadata?.totalPages || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  openCreate() {
    this.editingId = null;
    this.form.reset({ duration: 60 });
    this.showModal = true;
  }

  openEdit(exam: Exam) {
    this.editingId = exam.id;
    this.form.patchValue({
      title: exam.title,
      description: exam.description,
      image: exam.image,
      duration: exam.duration,
      diplomaId: exam.diplomaId,
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.form.reset({ duration: 60 });
    this.editingId = null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const val = this.form.value;
    if (this.editingId) {
      this.adminService.updateExam(this.editingId, val as UpdateExamRequest).subscribe({
        next: () => {
          this.loading = false;
          this.closeModal();
          this.loadExams(this.currentPage);
          this.showToast('Exam updated successfully', 'success');
        },
        error: (err: any) => {
          this.loading = false;
          this.showToast(err.error?.message || 'Failed to update exam', 'error');
        },
      });
    } else {
      this.adminService.createExam(val as CreateExamRequest).subscribe({
        next: () => {
          this.loading = false;
          this.closeModal();
          this.loadExams(this.currentPage);
          this.showToast('Exam created successfully', 'success');
        },
        error: (err: any) => {
          this.loading = false;
          this.showToast(err.error?.message || 'Failed to create exam', 'error');
        },
      });
    }
  }

  confirmDelete(id: string) { this.deletingId = id; }
  cancelDelete() { this.deletingId = null; }

  onDelete() {
    if (!this.deletingId) return;
    this.loading = true;
    this.adminService.deleteExam(this.deletingId).subscribe({
      next: () => {
        this.loading = false;
        this.deletingId = null;
        this.loadExams(this.currentPage);
        this.showToast('Exam deleted successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to delete exam', 'error');
      },
    });
  }

  toggleImmutable(exam: Exam) {
    this.adminService.toggleExamImmutable(exam.id).subscribe({
      next: () => this.loadExams(this.currentPage),
      error: (err: any) => this.showToast(err.error?.message || 'Failed to toggle', 'error'),
    });
  }

  goToQuestions(examId: string) {
    this.router.navigate(['/admin/exams', examId, 'questions']);
  }

  getDiplomaName(id: string): string {
    return this.diplomas().find(d => d.id === id)?.title || '—';
  }
}
