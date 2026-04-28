export const AuthEndPoints = {
  BASE_URL: 'https://exam-app.elevate-bootcamp.cloud/api/auth',
} as const;

export const API_ENDPOINTS = {
  SEND_EMAIL_VERIFICATION: `${AuthEndPoints.BASE_URL}/send-email-verification`,
  CONFIRM_EMAIL_VERIFICATION: `${AuthEndPoints.BASE_URL}/confirm-email-verification`,
  REGISTER: `${AuthEndPoints.BASE_URL}/register`,
  LOGIN: `${AuthEndPoints.BASE_URL}/login`,
  FORGOT_PASSWORD: `${AuthEndPoints.BASE_URL}/forgot-password`,
  RESET_PASSWORD: `${AuthEndPoints.BASE_URL}/reset-password`,
} as const;