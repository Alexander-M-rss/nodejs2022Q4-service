import { Artist } from 'src/artists/interfaces/artist.interface';
import { User } from 'src/users/interfaces/user.interface';
import { Track } from 'src/tracks/interfaces/track.interface';

export interface DB {
  users: Record<string, User>;
  artists: Record<string, Artist>;
  tracks: Record<string, Track>;
}
