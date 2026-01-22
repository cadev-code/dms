export interface LoginBody {
  username: string;
  password: string;
}

export interface Auth {
  userId: number;
}

export interface User {
  id: number;
  fullname: string;
  username: string;
  role: 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'USER';
}
