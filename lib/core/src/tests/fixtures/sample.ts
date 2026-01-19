import { Role } from '../../auth-domain/enums/roles.enum';
import { User } from '../../users-domain/entities/user.entity';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@test.com',
  username: 'test',
  password: 'hashedPassword',
  roles: [Role.USER],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
