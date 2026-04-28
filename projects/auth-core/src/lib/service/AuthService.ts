import { inject, Injectable } from '@angular/core';
import {
  ConfirmEmailVerification,
  LoginResponse,
  LoginUser,
  RegisterUser,
  VerifyEmail,
} from '../models/user';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthApi } from '../base/AuthApi';
import { API_ENDPOINTS } from '../enums/authEndPoints';
import { AuthAdaptor } from '../adaptor/authAdapter';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthApi {
  private readonly http = inject(HttpClient);
  private readonly authAdaptor = inject(AuthAdaptor);

  register(user: RegisterUser): Observable<any> {
    return this.http.post(API_ENDPOINTS.REGISTER, user).pipe(
      map((res: any) => this.authAdaptor.adapt(res)),
      catchError((err) => of(err.error)),
    );
  }

  login(user: LoginUser): Observable<LoginResponse> {
    return this.http.post(API_ENDPOINTS.LOGIN, user).pipe(
      map((res: any) => this.authAdaptor.adapt(res)),
      catchError((err) => of(err.error)),
    );
  }

  verifyEmail(email: VerifyEmail): Observable<any> {
    return this.http.post(API_ENDPOINTS.SEND_EMAIL_VERIFICATION, email).pipe(
      map((res: any) => this.authAdaptor.adapt(res)),
      catchError((err) => of(err.error)),
    );
  }

  confirmEmail(confirm: ConfirmEmailVerification): Observable<any> {
    return this.http.post(API_ENDPOINTS.CONFIRM_EMAIL_VERIFICATION, confirm).pipe(
      map((res: any) => this.authAdaptor.adapt(res)),
      catchError((err) => of(err.error)),
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }).pipe(
      map((res: any) => this.authAdaptor.adapt(res)),
      catchError((err) => of(err.error)),
    );
  }
}