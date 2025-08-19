import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity'; 
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UUID } from 'crypto';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Fetch permissions by their IDs (UUIDs)
    const permissions = await this.permissionRepository.find({
      where: { id: In(createRoleDto.permissions) }, // Fetch permissions by their UUIDs
    });

    // Create the role with permissions
    const role = this.roleRepository.create({
      ...createRoleDto, // spread the other properties from the DTO
      permissions, // add the resolved permissions here
    });

    // Save the role with the associated permissions
    await this.roleRepository.save(role);

    return role;
  }

  // Find all roles with their associated permissions and users
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions', 'users'],
    });
  }

  // Find a role by its ID and include associated permissions and users
  async findOne(id: UUID): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }

    return role;
  }

  // Update a role and its permissions
  async update(id: UUID, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Fetch the permissions to update with
    const permissions = await this.permissionRepository.find({
      where: { id: In(updateRoleDto.permissions) }, // Fetch permissions by their UUIDs
    });

    // Ensure permissions are updated correctly
    await this.roleRepository.update(id, { ...updateRoleDto, permissions });

    return this.findOne(id); // Return the updated role
  }

  // Delete a role
  async remove(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
