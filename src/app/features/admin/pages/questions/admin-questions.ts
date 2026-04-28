import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../shared/services/admin.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ToastComponent } from '../../../../shared/components/toast/toast';
import { Question } from '../../../../shared/models/dashboard';
import { CreateQuestionRequest, UpdateQuestionRequest } from '../../../../shared/models/admin.models';

interface AnswerForm {
  text: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-admin-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './admin-questions.html',
  styleUrl: './admin-questions.css',
})
export class AdminQuestionsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly dashboardService = inject(DashboardService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  questions = signal<Question[]>([]);
  loading = false;
  showModal = false;
  editingId: string | null = null;
  deletingId: string | null = null;
  examId = '';
  examTitle = '';

  answers: AnswerForm[] = [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ];

  form: FormGroup;

  toastMessage = signal('');
  toastType = signal<'success' | 'error' | 'info'>('info');
  toastVisible = signal(false);

  constructor() {
    this.form = this.fb.group({
      text: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.loadQuestions();
    this.loadExamTitle();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 4000);
  }

  loadExamTitle() {
    if (!this.examId) return;
    this.dashboardService.getExam(this.examId).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.examTitle = payload?.exam?.title || 'Exam';
      },
    });
  }

  loadQuestions() {
    if (!this.examId) return;
    this.loading = true;
    this.dashboardService.getQuestions(this.examId).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.questions.set(payload?.questions || []);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  openCreate() {
    this.editingId = null;
    this.form.reset();
    this.answers = [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ];
    this.showModal = true;
  }

  openEdit(question: Question) {
    this.editingId = question.id;
    this.form.patchValue({ text: question.text });
    this.answers = question.answers.map(a => ({ text: a.text, isCorrect: false }));
    while (this.answers.length < 4) this.answers.push({ text: '', isCorrect: false });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
    this.editingId = null;
  }

  addAnswer() {
    this.answers.push({ text: '', isCorrect: false });
  }

  removeAnswer(index: number) {
    if (this.answers.length > 2) this.answers.splice(index, 1);
  }

  setCorrect(index: number) {
    this.answers.forEach((a, i) => (a.isCorrect = i === index));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const validAnswers = this.answers.filter(a => a.text.trim());
    if (validAnswers.length < 2) {
      this.showToast('At least 2 answers are required', 'error');
      return;
    }
    if (!validAnswers.some(a => a.isCorrect)) {
      this.showToast('Mark one answer as correct', 'error');
      return;
    }

    this.loading = true;
    if (this.editingId) {
      const payload: UpdateQuestionRequest = {
        text: this.form.value.text,
        answers: validAnswers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
      };
      this.adminService.updateQuestion(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.closeModal();
          this.loadQuestions();
          this.showToast('Question updated successfully', 'success');
        },
        error: (err: any) => {
          this.loading = false;
          this.showToast(err.error?.message || 'Failed to update question', 'error');
        },
      });
    } else {
      const payload: CreateQuestionRequest = {
        text: this.form.value.text,
        examId: this.examId,
        answers: validAnswers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
      };
      this.adminService.createQuestion(payload).subscribe({
        next: () => {
          this.loading = false;
          this.closeModal();
          this.loadQuestions();
          this.showToast('Question created successfully', 'success');
        },
        error: (err: any) => {
          this.loading = false;
          this.showToast(err.error?.message || 'Failed to create question', 'error');
        },
      });
    }
  }

  confirmDelete(id: string) { this.deletingId = id; }
  cancelDelete() { this.deletingId = null; }

  onDelete() {
    if (!this.deletingId) return;
    this.loading = true;
    this.adminService.deleteQuestion(this.deletingId).subscribe({
      next: () => {
        this.loading = false;
        this.deletingId = null;
        this.loadQuestions();
        this.showToast('Question deleted successfully', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showToast(err.error?.message || 'Failed to delete question', 'error');
      },
    });
  }
}
