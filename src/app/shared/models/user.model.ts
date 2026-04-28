export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
