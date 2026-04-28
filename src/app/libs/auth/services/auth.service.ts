import { inject, Injectable, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import {
  API_ENDPOINTS,
  AuthService as CoreAuthService,
} from 'auth-core';
import { extractToken, mapLoginResponseToUser } from '../adapters/auth.adapter';
import {
  LoginRequest,
  RegisterRequest,
  SendEmailVerificationRequest,
  ConfirmEmailVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../models/auth.models';
import { User } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly coreAuthService = inject(CoreAuthService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  login(payload: LoginRequest): Observable<any> {
    return this.coreAuthService
      .login(payload)
      .pipe(
        map((response: any) => this.assertSuccess(response)),
        tap((response: any) => {
          const token = extractToken(response);
          if (!token) {
            throw { error: response };
          }
          const { user } = mapLoginResponseToUser(response);
          this._token.set(token);
          this._currentUser.set(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
          }
        })
      );
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.coreAuthService
      .register(payload)
      .pipe(map((response: any) => this.assertSuccess(response)));
  }

  sendEmailVerification(payload: SendEmailVerificationRequest): Observable<any> {
    return this.coreAuthService
      .verifyEmail(payload)
      .pipe(map((response: any) => this.assertSuccess(response)));
  }

  confirmEmailVerification(payload: ConfirmEmailVerificationRequest): Observable<any> {
    return this.coreAuthService
      .confirmEmail(payload)
      .pipe(map((response: any) => this.assertSuccess(response)));
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<any> {
    return this.coreAuthService
      .forgotPassword(payload.email)
      .pipe(map((response: any) => this.assertSuccess(response)));
  }

  resetPassword(payload: ResetPasswordRequest): Observable<any> {
    return this.httpClient
      .post(API_ENDPOINTS.RESET_PASSWORD, payload)
      .pipe(map((response: any) => this.assertSuccess(response)));
  }

  loadTokenFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this._token.set(storedToken);
      }
    }
  }

  logout(): void {
    this._token.set(null);
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  private assertSuccess(response: any): any {
    if (response?.status === false) {
      throw { error: response };
    }
    if (typeof response?.code === 'number' && response.code >= 400) {
      throw { error: response };
    }
    return response;
  }
}
