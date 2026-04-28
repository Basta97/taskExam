import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_API_URL } from '../../libs/auth/auth.token';
import {
  ApiResponse,
  Diploma,
  DiplomaDetail,
  Exam,
  Question,
  Submission,
  SubmissionPayload,
  SubmissionResult,
} from '../models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(AUTH_API_URL);

  getDiplomas(page: number = 1, limit: number = 12): Observable<ApiResponse<{ data: Diploma[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>> {
    return this.http.get<ApiResponse<{ data: Diploma[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>>(`${this.baseUrl}/diplomas?page=${page}&limit=${limit}`);
  }

  getDiploma(id: string): Observable<ApiResponse<{ diploma: DiplomaDetail }>> {
    return this.http.get<ApiResponse<{ diploma: DiplomaDetail }>>(`${this.baseUrl}/diplomas/${id}`);
  }

  getExams(page: number = 1, limit: number = 12, diplomaId?: string): Observable<ApiResponse<{ data: Exam[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>> {
    let url = `${this.baseUrl}/exams?page=${page}&limit=${limit}`;
    if (diplomaId) {
      url += `&diplomaId=${diplomaId}`;
    }
    return this.http.get<ApiResponse<{ data: Exam[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>>(url);
  }

  getExam(id: string): Observable<ApiResponse<{ exam: Exam }>> {
    return this.http.get<ApiResponse<{ exam: Exam }>>(`${this.baseUrl}/exams/${id}`);
  }

  getQuestions(examId: string): Observable<ApiResponse<{ questions: Question[] }>> {
    return this.http.get<ApiResponse<{ questions: Question[] }>>(`${this.baseUrl}/questions/exam/${examId}`);
  }

  submitExam(payload: SubmissionPayload): Observable<ApiResponse<{ submission: SubmissionResult; analytics: Submission['analytics'] }>> {
    return this.http.post<ApiResponse<{ submission: SubmissionResult; analytics: Submission['analytics'] }>>(`${this.baseUrl}/submissions`, payload);
  }

  getSubmission(id: string): Observable<ApiResponse<{ submission: SubmissionResult; analytics: Submission['analytics'] }>> {
    return this.http.get<ApiResponse<{ submission: SubmissionResult; analytics: Submission['analytics'] }>>(`${this.baseUrl}/submissions/${id}`);
  }

  getSubmissions(page: number = 1, limit: number = 12): Observable<ApiResponse<{ data: SubmissionResult[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>> {
    return this.http.get<ApiResponse<{ data: SubmissionResult[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>>(`${this.baseUrl}/submissions?page=${page}&limit=${limit}`);
  }
}
