import { Artist } from 'src/artists/interfaces/artist.interface';
import { User } from 'src/users/interfaces/user.interface';

export interface DB {
  users: Record<string, User>;
  artists: Record<string, Artist>;
}
