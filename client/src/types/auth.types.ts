import { User } from './user.types';

export interface LoginBody {
  username: string;
  password: string;
}

export interface Auth {
  userId: number;
  fullname: string;
  role: User['role'];
  mustChangePassword: boolean;
}
