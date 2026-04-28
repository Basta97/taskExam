export interface PaginationMetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: boolean;
  code: number;
  message?: string;
  payload: T;
}

export interface Diploma {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiplomaDetail extends Diploma {
  exams: ExamListItem[];
}

export interface ExamListItem {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  createdAt: string;
  questionsCount: number;
}

export interface ExamDiploma {
  id: string;
  title: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  diploma: ExamDiploma;
  questionsCount: number;
}

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  examId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
}

export interface SubmissionAnswer {
  questionId: string;
  answerId: string;
}

export interface SubmissionPayload {
  examId: string;
  answers: SubmissionAnswer[];
}

export interface SubmissionResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
}

export interface AnalyticsAnswer {
  id: string;
  text: string;
}

export interface SubmissionAnalytics {
  questionId: string;
  questionText: string;
  selectedAnswer: AnalyticsAnswer;
  isCorrect: boolean;
  correctAnswer: AnalyticsAnswer;
}

export interface Submission extends SubmissionResult {
  analytics: SubmissionAnalytics[];
}
