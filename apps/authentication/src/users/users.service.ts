import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../../lib/core/src/users-domain/repositories/users.repository';
import { User } from '../../../../lib/core/src/users-domain/entities/user.entity';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  /**
   * Create a new user
   * Note: Password should already be hashed by the caller (e.g., AuthService)
   */
  async createUser(userData: {
    email: string;
    username: string;
    password: string;
    roles?: Role[];
  }): Promise<User> {
    return await this.usersRepository.create(userData);
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    userData: Partial<Omit<User, 'id' | 'password'>>,
  ): Promise<User> {
    const user = await this.usersRepository.update(id, userData);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Update user password
   * Note: Password should already be hashed by the caller
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.usersRepository.update(id, {
      password: hashedPassword,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Check if email is already taken
   */
  async isEmailTaken(email: string): Promise<boolean> {
    return await this.usersRepository.existsByEmail(email);
  }

  /**
   * Check if username is already taken
   */
  async isUsernameTaken(username: string): Promise<boolean> {
    return await this.usersRepository.existsByUsername(username);
  }

  /**
   * Get total user count
   */
  async getUserCount(): Promise<number> {
    return (await this.usersRepository.count()) as unknown as number;
  }

  /**
   * Get count of users by role
   */
  async getUserCountByRole(role: Role): Promise<number> {
    return (await this.usersRepository.countByRole(role)) as unknown as number;
  }
}
