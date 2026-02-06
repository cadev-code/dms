export interface User {
  id: number;
  fullname: string;
  username: string;
  role: 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'USER';
  isActive: boolean;
}
