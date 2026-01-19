import { User } from '../entities/user.entity';
import { Role } from '../../auth-domain/enums/roles.enum';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}
}

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findProfileById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(userData: {
    email: string;
    username: string;
    password: string;
    roles?: Role[];
  }): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
}
