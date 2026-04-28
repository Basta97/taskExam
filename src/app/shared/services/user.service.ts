import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_API_URL } from '../../libs/auth/auth.token';
import { ApiResponse } from '../models/dashboard';
import { User } from '../models/user.model';
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  RequestEmailChangeRequest,
  ConfirmEmailChangeRequest,
  DeleteAccountRequest,
} from '../models/account.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(AUTH_API_URL);

  getProfile(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.baseUrl}/users/profile`);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(`${this.baseUrl}/users/profile`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/users/change-password`, payload);
  }

  requestEmailChange(payload: RequestEmailChangeRequest): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/users/change-email`, payload);
  }

  confirmEmailChange(payload: ConfirmEmailChangeRequest): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/users/confirm-change-email`, payload);
  }

  deleteAccount(payload: DeleteAccountRequest): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/users/delete-account`, payload);
  }
}
