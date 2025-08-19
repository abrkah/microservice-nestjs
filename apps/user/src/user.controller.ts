import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('create_user')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    console.log('User microservice: create_user called with:', createUserDto);
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() payload: { id: string }) {
    return this.userService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'get_user_by_email' }) // already fine
  async getUserByEmail(@Payload() payload: { email: string }) {
    return this.userService.findByEmail(payload.email);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(@Payload() payload: { id: string; data: UpdateUserDto }) {
    return this.userService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'change_password' })
  async changePassword(
    @Payload()
    payload: {
      id: string;
      oldPassword: string;
      newPassword: string;
    },
  ) {
    return this.userService.changePassword(
      payload.id,
      payload.oldPassword,
      payload.newPassword,
    );
  }

  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(
    @Payload() payload: { email: string; newPassword: string },
  ) {
    return this.userService.resetPassword(payload.email, payload.newPassword);
  }

  @MessagePattern({ cmd: 'update_all_passwords' })
  async updateAllPasswords(@Payload() payload: { newPassword: string }) {
    return this.userService.updatePasswords(payload.newPassword);
  }
}
