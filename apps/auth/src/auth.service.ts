import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}
  async findUserByEmail(email: string) {
    return await lastValueFrom(
      this.userClient.send({ cmd: 'get_user_by_email' }, { email }),
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('User Not Found');

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid Credentials');

    return { id: user.id };
  }

  login(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async validateJwtUser(userId: string) {
    const user = await lastValueFrom(
      this.userClient.send('get_user_by_id', { id: userId }),
    );
    if (!user) throw new UnauthorizedException('User not found!');

    return { id: user.id, role: user.role };
  }

  async validateJwtToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
