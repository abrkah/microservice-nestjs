import { Controller } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @MessagePattern({ cmd: 'create_permission' })
  async create(@Payload() body: Partial<Permission>): Promise<Permission> {
    console.log('Received permission data:', body);
    const response = await this.permissionService.create(body);
    console.log('Created permission:', response);
    return response;
  }

  @MessagePattern({ cmd: 'find_all_permissions' })
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_permission' })
  async findOne(@Payload() id: string): Promise<Permission> {
    return this.permissionService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_permission' })
  async update(
    @Payload() data: { id: string; updateData: Partial<Permission> },
  ): Promise<Permission> {
    console.log('Update permission request:', data);
    return this.permissionService.update(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'remove_permission' })
  async remove(@Payload() id: string): Promise<void> {
    return this.permissionService.remove(id);
  }
}
