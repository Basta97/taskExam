import { Observable } from 'rxjs';
import { ConfirmEmailVerification, LoginResponse, RegisterUser, User, VerifyEmail } from '../models/user';

export abstract class AuthApi {
  abstract register(user: RegisterUser): Observable<any>;
  abstract login(user: User): Observable<LoginResponse>;
  abstract verifyEmail(email: VerifyEmail): Observable<any>;
  abstract confirmEmail(confirm: ConfirmEmailVerification): Observable<any>;
  abstract forgotPassword(email: string): Observable<any>;
}