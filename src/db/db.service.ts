import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DB } from './interfaces/db.interface';
import { User } from 'src/users/interfaces/user.interface';
import { v4 as newUuid } from 'uuid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { Artist } from 'src/artists/interfaces/artist.interface';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artists/dto/update-artist.dto';
import { Track } from 'src/tracks/interfaces/track.interface';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { UpdateTrackDto } from 'src/tracks/dto/update-track.dto';
import { Album } from 'src/albums/interfaces/album.interface';
import { CreateAlbumDto } from 'src/albums/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/albums/dto/update-album.dto';
import { FavoritesRepsonse } from 'src/favorites/interfaces/response.interface';
import { FavoritesEntityType } from 'src/favorites/types/favorites-entity-type';

type EntityType = FavoritesEntityType | 'user';
type FavoritesTables = 'tracks' | 'artists' | 'albums';

@Injectable()
export class DbService {
  private db: DB = {
    users: {},
    artists: {},
    tracks: {},
    albums: {},
    favorites: {
      artists: [],
      albums: [],
      tracks: [],
    },
  };

  private checkEntityExistance(entityType: EntityType, id: string) {
    const table = entityType + 's';

    if (this.db[table][id] === undefined) {
      throw new NotFoundException(`${entityType} Id doesn't exist`);
    }
  }

  private deleteFrom(
    entity: 'tracks' | 'albums',
    idKey: 'artistId' | 'albumId',
    id: string,
  ) {
    const entries = Object.entries(this.db[entity]).map((entry) => {
      if (entry[1]?.[idKey] === id) {
        entry[1][idKey] = null;
      }

      return entry;
    });
    this.db[entity] = Object.fromEntries(entries);
  }

  private removeFromFavorites(
    entityType: FavoritesEntityType,
    id: string,
  ): void {
    const table = entityType + 's';
    const idx = this.db.favorites[table].findIndex((item) => item === id);

    if (idx < 0) {
      return;
    }

    this.db.favorites[table].splice(idx, 1);
  }

  getUsers(): Omit<User, 'password'>[] {
    return Object.values(this.db.users).map((user) => {
      const userWoPassword = { ...user };
      delete userWoPassword.password;

      return userWoPassword;
    });
  }

  getUser(id: string): Omit<User, 'password'> {
    this.checkEntityExistance('user', id);

    const userWoPassword = { ...this.db.users[id] };
    delete userWoPassword.password;

    return userWoPassword;
  }

  createUser(user: CreateUserDto): Omit<User, 'password'> {
    const id = newUuid();
    const createdAt = Date.now();
    const newUser: User = {
      id,
      ...user,
      version: 1,
      createdAt,
      updatedAt: createdAt,
    };

    this.db.users[id] = { ...newUser };
    delete newUser.password;

    return newUser;
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    this.checkEntityExistance('user', id);
    const user = this.db.users[id];

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorect');
    }

    const updatedUser: User = {
      ...user,
      updatedAt: Date.now(),
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
    };

    this.db.users[id] = { ...updatedUser };
    delete updatedUser.password;

    return updatedUser;
  }

  deleteUser(id: string): void {
    this.checkEntityExistance('user', id);
    delete this.db.users[id];
  }

  getArtists(): Artist[] {
    return Object.values(this.db.artists);
  }

  getArtist(id: string): Artist {
    this.checkEntityExistance('artist', id);

    return this.db.artists[id];
  }

  createArtist(artist: CreateArtistDto): Artist {
    const id = newUuid();
    const newArtist: Artist = {
      id,
      ...artist,
    };
    this.db.artists[id] = { ...newArtist };

    return newArtist;
  }

  updateArtist(id: string, updateArtistDto: UpdateArtistDto): Artist {
    this.checkEntityExistance('artist', id);

    const updatedArtist = { ...this.db.artists[id], ...updateArtistDto };

    this.db.artists[id] = updatedArtist;

    return updatedArtist;
  }

  deleteArtist(id: string): void {
    this.checkEntityExistance('artist', id);
    this.deleteFrom('tracks', 'artistId', id);
    this.deleteFrom('albums', 'artistId', id);
    this.removeFromFavorites('artist', id);
    delete this.db.artists[id];
  }

  getTracks(): Track[] {
    return Object.values(this.db.tracks);
  }

  getTrack(id: string): Track {
    this.checkEntityExistance('track', id);

    return this.db.tracks[id];
  }

  createTrack(track: CreateTrackDto): Track {
    if (track.artistId) {
      try {
        this.checkEntityExistance('artist', track.artistId);
      } catch (_) {
        throw new BadRequestException(
          "Artist with such artistId doesn't exist",
        );
      }
    }
    if (track.albumId) {
      try {
        this.checkEntityExistance('album', track.albumId);
      } catch (_) {
        throw new BadRequestException("Album with such albumId doesn't exist");
      }
    }

    const id = newUuid();
    const newTrack: Track = {
      id,
      ...track,
      albumId: track.albumId ?? null,
      artistId: track.artistId ?? null,
    };
    this.db.tracks[id] = { ...newTrack };

    return newTrack;
  }

  updateTrack(id: string, updateTrackDto: UpdateTrackDto): Track {
    this.checkEntityExistance('track', id);
    if (updateTrackDto.artistId) {
      try {
        this.checkEntityExistance('artist', updateTrackDto.artistId);
      } catch (_) {
        throw new BadRequestException(
          "Artist with such artistId doesn't exist",
        );
      }
    }
    if (updateTrackDto.albumId) {
      try {
        this.checkEntityExistance('album', updateTrackDto.albumId);
      } catch (_) {
        throw new BadRequestException("Album with such albumId doesn't exist");
      }
    }

    const updatedTrack = { ...this.db.tracks[id], ...updateTrackDto };

    this.db.tracks[id] = updatedTrack;

    return updatedTrack;
  }

  deleteTrack(id: string): void {
    this.checkEntityExistance('track', id);
    this.removeFromFavorites('track', id);
    delete this.db.tracks[id];
  }

  getAlbums(): Album[] {
    return Object.values(this.db.albums);
  }

  getAlbum(id: string): Album {
    this.checkEntityExistance('album', id);

    return this.db.albums[id];
  }

  createAlbum(album: CreateAlbumDto): Album {
    if (album.artistId) {
      try {
        this.checkEntityExistance('artist', album.artistId);
      } catch (_) {
        throw new BadRequestException(
          "Artist with such artistId doesn't exist",
        );
      }
    }
    const id = newUuid();
    const newAlbum: Album = {
      id,
      ...album,
      artistId: album.artistId ?? null,
    };
    this.db.albums[id] = { ...newAlbum };

    return newAlbum;
  }

  updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    this.checkEntityExistance('album', id);
    if (updateAlbumDto.artistId) {
      try {
        this.checkEntityExistance('artist', updateAlbumDto.artistId);
      } catch (_) {
        throw new BadRequestException(
          "Artist with such artistId doesn't exist",
        );
      }
    }

    const updatedAlbum = { ...this.db.albums[id], ...updateAlbumDto };

    this.db.albums[id] = updatedAlbum;

    return updatedAlbum;
  }

  deleteAlbum(id: string): void {
    this.checkEntityExistance('album', id);
    this.deleteFrom('tracks', 'albumId', id);
    this.removeFromFavorites('album', id);
    delete this.db.albums[id];
  }

  private getFromFavorites<T>(entity: FavoritesTables): T[] {
    return Object.values(this.db[entity]).filter((item) =>
      this.db.favorites[entity].includes(item.id),
    );
  }

  getFavorites(): FavoritesRepsonse {
    return {
      artists: this.getFromFavorites('artists'),
      albums: this.getFromFavorites('albums'),
      tracks: this.getFromFavorites('tracks'),
    };
  }

  addEntityToFavorites(entityType: FavoritesEntityType, id: string): string {
    try {
      this.checkEntityExistance(entityType, id);
    } catch (_) {
      throw new UnprocessableEntityException(
        `${entityType} with such id doesn't exist`,
      );
    }

    const table = (entityType + 's') as FavoritesTables;

    if (!this.db.favorites[table].includes(id)) {
      this.db.favorites[table].push(id);
    }

    return `${entityType} has been added to favorites`;
  }

  removeEntityFromFavorites(
    entityType: FavoritesEntityType,
    id: string,
  ): string {
    const table = (entityType + 's') as FavoritesTables;
    const idx = this.db.favorites[table].findIndex((item) => item === id);

    if (idx < 0) {
      throw new NotFoundException(`${entityType} is not favorite`);
    }

    this.db.favorites[table].splice(idx, 1);

    return `${entityType} has been removed from favorites`;
  }
}
