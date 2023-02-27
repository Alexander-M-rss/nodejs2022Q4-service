import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Tokens } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<Tokens> {
    const { login, password } = loginUserDto;
    const user = await this.usersService.findByLogin(login);

    if (!(user && compare(password, user.password))) {
      throw new ForbiddenException('Incorrect login/password combination');
    }

    return this.generateTokens(user.id, login);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<Tokens> {
    const { refreshToken } = refreshTokenDto;
    if (!refreshToken) {
      throw new UnauthorizedException('refreshToken is missing');
    }
    try {
      const { userId, login } = await this.jwtService.verify(
        refreshTokenDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );
      return this.generateTokens(userId, login);
    } catch (err) {
      if (err.name && err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('refreshToken is not a JWT');
      } else {
        throw new ForbiddenException('Invalid token');
      }
    }
  }

  private async generateTokens(userId: string, login: string): Promise<Tokens> {
    const payload = { userId, login };
    const accessOpt = {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    };
    const refreshOpt = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessOpt),
      this.jwtService.signAsync(payload, refreshOpt),
    ]);

    return { accessToken, refreshToken };
  }
}
