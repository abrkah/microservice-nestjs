import { Controller, UnauthorizedException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto'; 
import { lastValueFrom } from 'rxjs';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  // Signup - forward createUserDto to user microservice
  @MessagePattern('auth_signup')
  async signup(@Payload() createUserDto: CreateUserDto): Promise<string> {
    return lastValueFrom(
      this.userClient.send<string, CreateUserDto>('create_user', createUserDto),
    );
  }

  @MessagePattern('auth_login')
  async login(@Payload() payload: { email: string; password: string }) {
    console.log('Auth Microservice received login payload:', payload);

    const user = await lastValueFrom(
      this.userClient.send(
        { cmd: 'get_user_by_email' },
        { email: payload.email },
      ),
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.authService.validateUser(payload.email, payload.password);

    const token = this.authService.login(user.id);
    return { id: user.id, token, role: user.role?.name || null };
  }

  // Validate JWT token
  @MessagePattern({ cmd: 'auth_validate_token' })
  async validateToken(@Payload() payload: { token: string }) {
    return this.authService.validateJwtToken(payload.token);
  }
}
