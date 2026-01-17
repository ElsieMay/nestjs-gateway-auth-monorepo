import { User } from '../../entities';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@test.com',
  username: 'test',
  password: 'hashedPassword',
  ...overrides,
});
