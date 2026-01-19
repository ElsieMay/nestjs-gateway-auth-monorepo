import { Injectable, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UsersRepository } from '../../../../lib/core/src/users-domain/repositories/users.repository';
import { User } from '../../../../lib/core/src/users-domain/entities/user.entity';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    this.logger.info({ email }, 'Finding user by email');
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      this.logger.info({ email, userId: user.id }, 'User found by email');
    } else {
      this.logger.info({ email }, 'User not found by email');
    }
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    this.logger.info({ userId: id }, 'Finding user by ID');
    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn({ userId: id }, 'User not found by ID');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info({ userId: id }, 'User found by ID');
    return user;
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    this.logger.info('Finding all users');
    const users = await this.usersRepository.findAll();
    this.logger.info({ count: users.length }, 'Found all users');
    return users;
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
    this.logger.info(
      { email: userData.email, username: userData.username },
      'Creating new user',
    );
    const user = await this.usersRepository.create(userData);
    this.logger.info(
      { userId: user.id, email: user.email, username: user.username },
      'User created successfully',
    );
    return user;
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    userData: Partial<Omit<User, 'id' | 'password'>>,
  ): Promise<User> {
    this.logger.info({ userId: id }, 'Updating user');
    const user = await this.usersRepository.update(id, userData);
    if (!user) {
      this.logger.warn({ userId: id }, 'User not found for update');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info({ userId: id }, 'User updated successfully');
    return user;
  }

  /**
   * Update user password
   * Note: Password should already be hashed by the caller
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    this.logger.info({ userId: id }, 'Updating user password');
    const user = await this.usersRepository.update(id, {
      password: hashedPassword,
    });
    if (!user) {
      this.logger.warn({ userId: id }, 'User not found for password update');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info({ userId: id }, 'User password updated successfully');
    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    this.logger.info({ userId: id }, 'Deleting user');
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      this.logger.warn({ userId: id }, 'User not found for deletion');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info({ userId: id }, 'User deleted successfully');
  }

  /**
   * Check if email is already taken
   */
  async isEmailTaken(email: string): Promise<boolean> {
    this.logger.info({ email }, 'Checking if email is taken');
    const isTaken = await this.usersRepository.existsByEmail(email);
    this.logger.info({ email, isTaken }, 'Email check completed');
    return isTaken;
  }

  /**
   * Check if username is already taken
   */
  async isUsernameTaken(username: string): Promise<boolean> {
    this.logger.info({ username }, 'Checking if username is taken');
    const isTaken = await this.usersRepository.existsByUsername(username);
    this.logger.info({ username, isTaken }, 'Username check completed');
    return isTaken;
  }

  /**
   * Get total user count
   */
  async getUserCount(): Promise<number> {
    this.logger.info('Getting user count');
    const count = (await this.usersRepository.count()) as unknown as number;
    this.logger.info({ count }, 'User count retrieved');
    return count;
  }

  /**
   * Get count of users by role
   */
  async getUserCountByRole(role: Role): Promise<number> {
    this.logger.info({ role }, 'Getting user count by role');
    const count = (await this.usersRepository.countByRole(
      role,
    )) as unknown as number;
    this.logger.info({ role, count }, 'User count by role retrieved');
    return count;
  }
}
