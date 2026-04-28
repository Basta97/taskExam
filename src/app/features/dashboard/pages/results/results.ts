import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { SubmissionResult, SubmissionAnalytics } from '../../../../shared/models/dashboard';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);

  submission = signal<SubmissionResult>({
    id: '',
    examId: '',
    examTitle: '',
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    startedAt: '',
    submittedAt: '',
  });
  analytics = signal<SubmissionAnalytics[]>([]);
  diplomaTitle = signal('Diploma');
  loading = signal(true);
  error = signal('');

  circumference = 2 * Math.PI * 70;

  dashOffset = computed(() => {
    const score = this.submission().score;
    return this.circumference - (score / 100) * this.circumference;
  });

  scoreColor = computed(() => {
    const score = this.submission().score;
    if (score >= 80) return '#22C55E';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  });

  scoreTextColor = computed(() => {
    const score = this.submission().score;
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  });

  ngOnInit() {
    this.loadResult();
  }

  loadResult() {
    const submissionId = this.route.snapshot.paramMap.get('submissionId') || '';
    this.loading.set(true);
    this.dashboardService.getSubmission(submissionId).subscribe({
      next: (res: any) => {
        this.submission.set(res.payload.submission);
        this.analytics.set(res.payload.analytics || []);
        this.diplomaTitle.set(
          res?.payload?.submission?.exam?.diploma?.title ||
            res?.payload?.submission?.diplomaTitle ||
            'Diploma'
        );
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.error?.message || 'Failed to load results');
        this.loading.set(false);
      },
    });
  }

  restartExam() {
    if (!this.submission().examId) return;
    this.router.navigate(['/dashboard/exams', this.submission().examId, 'play']);
  }
}
