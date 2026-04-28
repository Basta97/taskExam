import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AUTH_API_URL } from '../../libs/auth/auth.token';
import { ApiResponse } from '../models/dashboard';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(AUTH_API_URL);
  private readonly directUploadEndpoint = '/api/upload';

  upload(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    // Primary path requested by backend contract.
    return this.http
      .post<ApiResponse<{ url: string }>>(this.directUploadEndpoint, formData)
      .pipe(
        // Fallback keeps compatibility when the app runs without /api proxying.
        catchError(() =>
          this.http.post<ApiResponse<{ url: string }>>(`${this.baseUrl}/upload`, formData)
        )
      );
  }
}
