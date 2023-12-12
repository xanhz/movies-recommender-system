import { Role } from '@prisma/client';

export interface UserRequest {
  id: number;
  email: string;
  role: Role;
}
