export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RequestEmailChangeRequest {
  newEmail: string;
}

export interface ConfirmEmailChangeRequest {
  newEmail: string;
  code: string;
}

export interface DeleteAccountRequest {
  password: string;
}
