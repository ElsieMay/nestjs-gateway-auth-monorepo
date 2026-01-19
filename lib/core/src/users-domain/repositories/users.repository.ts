import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../../auth-domain/enums/roles.enum';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({ where: { username } });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Find user by ID with selected fields for profile (excludes password)
   */
  async findProfileById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'roles', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  /**
   * Create a new user
   */
  async create(userData: {
    email: string;
    username: string;
    password: string;
    roles?: Role[];
  }): Promise<User> {
    const user = this.repository.create({
      ...userData,
      roles: userData.roles || [Role.USER],
    });
    return await this.repository.save(user);
  }

  /**
   * Update user
   */
  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    return await this.findById(id);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  /**
   * Check if user exists by username
   */
  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.repository.count({ where: { username } });
    return count > 0;
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    return await this.repository.count();
  }

  /**
   * Count users by role
   */
  async countByRole(role: Role): Promise<number> {
    return await this.repository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role })
      .getCount();
  }
}
