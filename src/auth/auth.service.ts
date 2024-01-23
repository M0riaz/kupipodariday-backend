import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entity/user';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
  async validatePassword(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const isPasswordValid = await this.hashService.compareHash(
        password,
        user.password,
      );
      if (isPasswordValid) {
        return user;
      }
    }
    throw new UnauthorizedException('Неверные данные');
  }
}
