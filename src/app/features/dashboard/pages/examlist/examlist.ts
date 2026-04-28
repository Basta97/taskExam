import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Exam } from '../../../../shared/models/dashboard';

@Component({
  selector: 'app-examlist',
  standalone: true,
  imports: [],
  templateUrl: './examlist.html',
})
export class Examlist implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  exams = signal<Exam[]>([]);
  loading = signal(true);
  error = signal('');
  currentPage = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.loading.set(true);
    this.error.set('');
    this.dashboardService.getExams(this.currentPage()).subscribe({
      next: (res: any) => {
        this.exams.set(res.payload.data);
        this.totalPages.set(res.payload.metadata.totalPages);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.error?.message || 'Failed to load exams');
        this.loading.set(false);
      },
    });
  }

  startExam(examId: string) {
    this.router.navigate(['/dashboard/exams', examId, 'play']);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadExams();
  }
}
