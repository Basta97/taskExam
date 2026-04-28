import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Question } from '../../../../shared/models/dashboard';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);

  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  selectedAnswers = signal<Record<string, string>>({});
  loading = signal(true);
  error = signal('');
  submitting = signal(false);
  examTitle = signal('');
  diplomaTitle = signal('');
  examDescription = signal('');
  examDuration = signal(0);
  remainingTime = signal(0);

  private timer: ReturnType<typeof setInterval> | null = null;
  private examId = '';

  currentQuestion = computed(() => this.questions()[this.currentIndex()] || null);
  answeredCount = computed(() => Object.keys(this.selectedAnswers()).length);
  progressPercentage = computed(() => (this.answeredCount() / this.questions().length) * 100);
  timerProgress = computed(() => {
    const total = this.examDuration() * 60;
    if (total <= 0) return 0;
    return (this.remainingTime() / total) * 100;
  });

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.loadExam();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  loadExam() {
    this.loading.set(true);
    this.error.set('');
    this.dashboardService.getExam(this.examId).subscribe({
      next: (res: any) => {
        const exam =
          res?.payload?.exam ||
          res?.payload?.data ||
          res?.exam ||
          res?.data ||
          null;
        this.examTitle.set(exam?.title || 'Exam');
        this.examDescription.set(exam?.description || '');
        this.examDuration.set(Number(exam?.duration || 0));
        this.diplomaTitle.set(exam?.diploma?.title || 'Diploma');
        this.loadQuestions();
      },
      error: (err: any) => {
        this.error.set(err?.error?.message || 'Failed to load exam');
        this.loading.set(false);
      },
    });
  }

  loadQuestions() {
    this.dashboardService.getQuestions(this.examId).subscribe({
      next: (res: any) => {
        const questions =
          res?.payload?.questions ||
          res?.payload?.data ||
          res?.questions ||
          res?.data ||
          [];
        this.questions.set(Array.isArray(questions) ? questions : []);
        if (!this.questions().length) {
          this.error.set('No questions found for this exam.');
          this.loading.set(false);
          return;
        }
        this.loading.set(false);
        this.startTimer();
      },
      error: (err: any) => {
        this.error.set(err?.error?.message || 'Failed to load questions');
        this.loading.set(false);
      },
    });
  }

  startTimer() {
    const durationInSeconds = Math.max(1, this.examDuration() * 60);
    this.remainingTime.set(durationInSeconds);
    this.timer = setInterval(() => {
      const current = this.remainingTime();
      if (current <= 1) {
        this.remainingTime.set(0);
        this.clearTimer();
        this.submitExam();
      } else {
        this.remainingTime.set(current - 1);
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  selectAnswer(questionId: string, answerId: string) {
    this.selectedAnswers.update(answers => ({ ...answers, [questionId]: answerId }));
  }

  nextQuestion() {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  previousQuestion() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.questions().length) {
      this.currentIndex.set(index);
    }
  }

  submitExam() {
    this.clearTimer();
    const answers = Object.entries(this.selectedAnswers()).map(([questionId, answerId]) => ({
      questionId,
      answerId,
    }));

    this.submitting.set(true);
    this.dashboardService.submitExam({ examId: this.examId, answers }).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        const submission =
          res?.payload?.submission ||
          res?.payload?.data ||
          res?.submission ||
          res?.data ||
          null;
        const submissionId = submission?.id;
        if (!submissionId) {
          this.error.set('Exam submitted, but no submission id was returned.');
          return;
        }
        this.router.navigate(['/dashboard/results', submissionId]);
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message || 'Failed to submit exam');
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/diplomas']);
  }
}
