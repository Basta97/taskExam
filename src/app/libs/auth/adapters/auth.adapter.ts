import { User } from '../../../shared/models/user.model';

export function extractToken(data: any): string {
  return (
    data?.token ||
    data?.payload?.token ||
    data?.payload?.accessToken ||
    data?.user?.token ||
    data?.data?.token ||
    data?.accessToken ||
    data?.access_token ||
    ''
  );
}

export function mapLoginResponseToUser(response: any): {
  token: string;
  user: User;
} {
  const token = extractToken(response);
  const email =
    response?.email?.email ||
    response?.email ||
    response?.user?.email ||
    response?.data?.email ||
    response?.payload?.email ||
    '';

  return {
    token,
    user: {
      id: response?.user?.id || response?.payload?.user?.id || '',
      email,
      firstName: response?.user?.firstName || response?.payload?.user?.firstName || '',
      lastName: response?.user?.lastName || response?.payload?.user?.lastName || '',
      username: response?.user?.username || response?.payload?.user?.username || '',
      phone: response?.user?.phone || response?.payload?.user?.phone || '',
      role: response?.user?.role || response?.payload?.user?.role || 'user',
      isVerified: response?.user?.isVerified || response?.payload?.user?.isVerified || false,
      avatar: response?.user?.avatar || response?.payload?.user?.avatar || '',
      createdAt: response?.user?.createdAt || response?.payload?.user?.createdAt || '',
      updatedAt: response?.user?.updatedAt || response?.payload?.user?.updatedAt || '',
    },
  };
}
