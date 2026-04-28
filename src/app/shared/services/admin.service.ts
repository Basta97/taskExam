import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_API_URL } from '../../libs/auth/auth.token';
import { ApiResponse, Diploma, Exam, Question } from '../models/dashboard';
import { User } from '../models/user.model';
import {
  AuditLog,
  AdminStats,
  CreateDiplomaRequest,
  UpdateDiplomaRequest,
  CreateExamRequest,
  UpdateExamRequest,
  CreateQuestionRequest,
  BulkCreateQuestionsRequest,
  UpdateQuestionRequest,
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(AUTH_API_URL);

  getStats(): Observable<ApiResponse<AdminStats>> {
    return this.http.get<ApiResponse<AdminStats>>(`${this.baseUrl}/stats`);
  }

  getAuditLogs(page: number = 1, limit: number = 20): Observable<ApiResponse<{ data: AuditLog[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>> {
    return this.http.get<ApiResponse<{ data: AuditLog[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>>(`${this.baseUrl}/audit-logs?page=${page}&limit=${limit}`);
  }

  seed(): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/seed`, {});
  }

  getUsers(page: number = 1, limit: number = 20): Observable<ApiResponse<{ data: User[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>> {
    return this.http.get<ApiResponse<{ data: User[]; metadata: { page: number; limit: number; total: number; totalPages: number } }>>(`${this.baseUrl}/users?page=${page}&limit=${limit}`);
  }

  deleteUser(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/users/${id}`);
  }

  createDiploma(payload: CreateDiplomaRequest): Observable<ApiResponse<{ diploma: Diploma }>> {
    return this.http.post<ApiResponse<{ diploma: Diploma }>>(`${this.baseUrl}/diplomas`, payload);
  }

  updateDiploma(id: string, payload: UpdateDiplomaRequest): Observable<ApiResponse<{ diploma: Diploma }>> {
    return this.http.put<ApiResponse<{ diploma: Diploma }>>(`${this.baseUrl}/diplomas/${id}`, payload);
  }

  deleteDiploma(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/diplomas/${id}`);
  }

  toggleDiplomaImmutable(id: string): Observable<ApiResponse<{ diploma: Diploma }>> {
    return this.http.patch<ApiResponse<{ diploma: Diploma }>>(`${this.baseUrl}/diplomas/${id}/toggle-immutable`, {});
  }

  createExam(payload: CreateExamRequest): Observable<ApiResponse<{ exam: Exam }>> {
    return this.http.post<ApiResponse<{ exam: Exam }>>(`${this.baseUrl}/exams`, payload);
  }

  updateExam(id: string, payload: UpdateExamRequest): Observable<ApiResponse<{ exam: Exam }>> {
    return this.http.put<ApiResponse<{ exam: Exam }>>(`${this.baseUrl}/exams/${id}`, payload);
  }

  deleteExam(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/exams/${id}`);
  }

  toggleExamImmutable(id: string): Observable<ApiResponse<{ exam: Exam }>> {
    return this.http.patch<ApiResponse<{ exam: Exam }>>(`${this.baseUrl}/exams/${id}/toggle-immutable`, {});
  }

  createQuestion(payload: CreateQuestionRequest): Observable<ApiResponse<{ question: Question }>> {
    return this.http.post<ApiResponse<{ question: Question }>>(`${this.baseUrl}/questions`, payload);
  }

  bulkCreateQuestions(payload: BulkCreateQuestionsRequest): Observable<ApiResponse<{ questions: Question[] }>> {
    return this.http.post<ApiResponse<{ questions: Question[] }>>(`${this.baseUrl}/questions/bulk`, payload);
  }

  updateQuestion(id: string, payload: UpdateQuestionRequest): Observable<ApiResponse<{ question: Question }>> {
    return this.http.put<ApiResponse<{ question: Question }>>(`${this.baseUrl}/questions/${id}`, payload);
  }

  deleteQuestion(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/questions/${id}`);
  }

  toggleQuestionImmutable(id: string): Observable<ApiResponse<{ question: Question }>> {
    return this.http.patch<ApiResponse<{ question: Question }>>(`${this.baseUrl}/questions/${id}/toggle-immutable`, {});
  }
}
