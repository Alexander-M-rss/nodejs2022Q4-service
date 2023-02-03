import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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

@Injectable()
export class DbService {
  private db: DB = {
    users: {},
    artists: {},
    tracks: {},
    albums: {},
  };

  private checkUserExistance(id: string) {
    if (this.db.users[id] === undefined) {
      throw new NotFoundException("User Id doesn't exist");
    }
  }

  private checkArtistExistance(id: string) {
    if (this.db.artists[id] === undefined) {
      throw new NotFoundException("Artist Id doesn't exist");
    }
  }

  private checkTrackExistance(id: string) {
    if (this.db.tracks[id] === undefined) {
      throw new NotFoundException("Track Id doesn't exist");
    }
  }

  private checkAlbumExistance(id: string) {
    if (this.db.albums[id] === undefined) {
      throw new NotFoundException("Album Id doesn't exist");
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

  getUsers(): Omit<User, 'password'>[] {
    return Object.values(this.db.users).map((user) => {
      const userWoPassword = { ...user };
      delete userWoPassword.password;

      return userWoPassword;
    });
  }

  getUser(id: string): Omit<User, 'password'> {
    this.checkUserExistance(id);

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
    this.checkUserExistance(id);
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
    this.checkUserExistance(id);
    delete this.db.users[id];
  }

  getArtists(): Artist[] {
    return Object.values(this.db.artists);
  }

  getArtist(id: string): Artist {
    this.checkArtistExistance(id);

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
    this.checkArtistExistance(id);

    const updatedArtist = { ...this.db.artists[id], ...updateArtistDto };

    this.db.artists[id] = updatedArtist;

    return updatedArtist;
  }

  deleteArtist(id: string): void {
    this.checkArtistExistance(id);
    this.deleteFrom('tracks', 'artistId', id);
    this.deleteFrom('albums', 'artistId', id);
    delete this.db.artists[id];
  }

  getTracks(): Track[] {
    return Object.values(this.db.tracks);
  }

  getTrack(id: string): Track {
    this.checkTrackExistance(id);

    return this.db.tracks[id];
  }

  createTrack(track: CreateTrackDto): Track {
    if (track.artistId) {
      try {
        this.checkArtistExistance(track.artistId);
      } catch (_) {
        throw new BadRequestException(
          "Artist with such artistId doesn't exist",
        );
      }
    }
    if (track.albumId) {
      try {
        this.checkAlbumExistance(track.albumId);
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
    this.checkTrackExistance(id);
    if (updateTrackDto.artistId) {
      try {
        this.checkArtistExistance(updateTrackDto.artistId);
      } catch (_) {
        throw new BadRequestException(
          "Artist with such artistId doesn't exist",
        );
      }
    }
    if (updateTrackDto.albumId) {
      try {
        this.checkAlbumExistance(updateTrackDto.albumId);
      } catch (_) {
        throw new BadRequestException("Album with such albumId doesn't exist");
      }
    }

    const updatedTrack = { ...this.db.tracks[id], ...updateTrackDto };

    this.db.tracks[id] = updatedTrack;

    return updatedTrack;
  }

  deleteTrack(id: string): void {
    this.checkTrackExistance(id);
    delete this.db.tracks[id];
  }

  getAlbums(): Album[] {
    return Object.values(this.db.albums);
  }

  getAlbum(id: string): Album {
    this.checkAlbumExistance(id);

    return this.db.albums[id];
  }

  createAlbum(album: CreateAlbumDto): Album {
    if (album.artistId) {
      try {
        this.checkArtistExistance(album.artistId);
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
    this.checkAlbumExistance(id);
    if (updateAlbumDto.artistId) {
      try {
        this.checkArtistExistance(updateAlbumDto.artistId);
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
    this.checkAlbumExistance(id);
    this.deleteFrom('tracks', 'albumId', id);
    delete this.db.albums[id];
  }
}
