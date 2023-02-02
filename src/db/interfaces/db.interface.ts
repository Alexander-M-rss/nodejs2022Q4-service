import { User } from 'src/users/interfaces/user.interface';

export interface DB {
  users: Record<string, User>;
}
