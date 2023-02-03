import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DB } from './interfaces/db.interface';
import { User } from 'src/users/interfaces/user.interface';
import { v4 as newUuid } from 'uuid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { Artist } from 'src/artists/interfaces/artist.interface';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artists/dto/update-artist.dto';

@Injectable()
export class DbService {
  private db: DB = {
    users: {},
    artists: {},
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
    delete this.db.artists[id];
  }
}
