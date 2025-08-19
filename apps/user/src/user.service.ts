import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<string> {
    try {
      if (!userDto.password) {
        throw new BadRequestException('Password is required');
      }

      if (!userDto.roleId) {
        throw new BadRequestException('Role ID is required');
      }

      const hashedPassword = await bcrypt.hash(userDto.password, 12);

      const user = this.userRepository.create({
        ...userDto,
        password: hashedPassword,
        roleId: userDto.roleId,
      });

      await this.userRepository.save(user);

      // await this.sendPasswordEmail(
      //   userDto.email,
      //   userDto.password,
      //   userDto.name ?? 'User',
      // );

      return 'User created successfully';
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw new Error('User creation failed: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, isDeleted: false } });
  }
  async sendPasswordEmail(email: string, password: string, name: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your IMS Account Password',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #007bff;">Selam, ${name}!</h1>
          <p style="font-size: 16px; line-height: 1.5;">
            Your Inventory Management System (IMS) account has been created. Please use the following password to log in:
          </p>
          <div style="margin: 20px 0; padding: 10px; background-color: #f8f9fa; border-radius: 10px; text-align: center;">
            <p style="font-size: 20px; font-weight: bold; color: #333; margin: 0;">${password}</p>
          </div>
          <p style="font-size: 14px; color: #555;">
            Please login using the link below and update your password for better security.
          </p>
          <p>
            <a href="${process.env.FRONT_BASE_URL}login" 
               style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px; text-align: center;">
              Login
            </a>
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Error sending email', error);
    }
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['role'], // Optional, if role eager loading needed
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .getMany();

    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;

    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async updatePasswords(newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update({}, { password: hashedPassword });
  }
}
