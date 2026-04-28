export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponse {
  message: string;
  token: string;
  email: string;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface VerifyEmail {
  email: string;
}

export interface ConfirmEmailVerification {
  email: string;
  code: string;
}