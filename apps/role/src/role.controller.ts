import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

type UUID = `${string}-${string}-${string}-${string}-${string}`;

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: 'create_role' })
  async create(@Payload() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @MessagePattern({ cmd: 'find_all_roles' })
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_role' })
  async findOne(@Payload() id: string): Promise<Role> {
    return this.roleService.findOne(id as UUID); // Type assertion to fix TS error
  }

  @MessagePattern({ cmd: 'update_role' })
  async update(
    @Payload() data: { id: string; updateRoleDto: UpdateRoleDto },
  ): Promise<Role> {
    return this.roleService.update(data.id as UUID, data.updateRoleDto);
  }

  @MessagePattern({ cmd: 'remove_role' })
  async remove(@Payload() id: string): Promise<void> {
    return this.roleService.remove(id as UUID);
  }
}
