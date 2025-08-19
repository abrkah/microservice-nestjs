import { IsString, IsArray, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsUUID('all', { each: true })
  permissions: string[]; // Array of permission UUIDs
}
