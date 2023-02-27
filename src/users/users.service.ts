import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';

const CRYPT_SALT = +process.env.CRYPT_SALT;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const newUser = {
      ...createUserDto,
      password: await hash(createUserDto.password, CRYPT_SALT),
    };

    const createdUser = this.userRepository.create(newUser);

    return (await this.userRepository.save(createdUser)).response();
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return (await this.userRepository.find()).map((user) => user.response());
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User Id doesn't exist");
    }

    return user.response();
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User Id doesn't exist");
    }
    if (!(await compare(updatePasswordDto.oldPassword, user.password))) {
      throw new ForbiddenException('Old password is incorect');
    }
    user.password = await hash(updatePasswordDto.newPassword, CRYPT_SALT);

    return (await this.userRepository.save(user)).response();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException("User Id doesn't exist");
    }
  }

  async findByLogin(login: string): Promise<User> {
    return await this.userRepository.findOne({ where: { login } });
  }
}
