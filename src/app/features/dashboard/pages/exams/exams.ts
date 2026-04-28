import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Exam } from '../../../../shared/models/dashboard';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);

  exams = signal<Exam[]>([]);
  loading = signal(true);
  error = signal('');
  diplomaTitle = signal('');
  diplomaId = signal('');
  currentPage = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.diplomaId.set(this.route.snapshot.paramMap.get('diplomaId') || '');
    this.loadDiplomaTitle();
    this.loadExams();
  }

  loadDiplomaTitle() {
    if (!this.diplomaId()) return;
    this.dashboardService.getDiploma(this.diplomaId()).subscribe({
      next: (res: any) => {
        const diploma =
          res?.payload?.diploma ||
          res?.payload?.data ||
          res?.diploma ||
          res?.data ||
          null;
        this.diplomaTitle.set(diploma?.title || 'Diploma');
      },
    });
  }

  loadExams() {
    this.loading.set(true);
    this.error.set('');
    this.dashboardService.getExams(this.currentPage(), 12, this.diplomaId() || undefined).subscribe({
      next: (res: any) => {
        const exams =
          res?.payload?.data ||
          res?.payload?.exams ||
          res?.data ||
          res?.exams ||
          [];
        const metadata = res?.payload?.metadata || res?.metadata || {};
        this.exams.set(exams);
        this.totalPages.set(metadata?.totalPages || 1);
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

  goBack() {
    this.router.navigate(['/dashboard/diplomas']);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadExams();
  }
}
