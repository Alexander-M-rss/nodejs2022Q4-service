import { Artist } from 'src/artists/interfaces/artist.interface';
import { User } from 'src/users/interfaces/user.interface';
import { Track } from 'src/tracks/interfaces/track.interface';
import { Album } from 'src/albums/interfaces/album.interface';
import { Favorites } from 'src/favorites/interfaces/favorites.interface';

export interface DB {
  users: Record<string, User>;
  artists: Record<string, Artist>;
  tracks: Record<string, Track>;
  albums: Record<string, Album>;
  favorites: Favorites;
}
