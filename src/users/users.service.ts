import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(createUserDto: CreateUserDto) {
    return this.dbService.createUser(createUserDto);
  }

  findAll() {
    return this.dbService.getUsers();
  }

  findOne(id: string) {
    return this.dbService.getUser(id);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    return this.dbService.updatePassword(id, updatePasswordDto);
  }

  remove(id: string) {
    return this.dbService.deleteUser(id);
  }
}
