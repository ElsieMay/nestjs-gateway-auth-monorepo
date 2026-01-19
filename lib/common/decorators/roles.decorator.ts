import { SetMetadata } from '@nestjs/common';
import { Role } from '../../core/src/auth-domain/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
