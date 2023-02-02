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

@Injectable()
export class DbService {
  private db: DB = {
    users: {},
  };

  private checkUserExistance(id: string) {
    if (this.db.users[id] === undefined) {
      throw new NotFoundException("User Id doesn't exist");
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
}
