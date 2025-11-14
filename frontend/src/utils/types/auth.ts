export interface RegisterUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
  isActive?: boolean;
}
