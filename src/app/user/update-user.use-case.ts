import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../contracts/user';
import { UserMapper } from '../../contracts/user';
import { User, Role } from '../../domain/user';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { UserDTO } from '../../contracts/user/dto';

interface UpdateUserInput {
  organizationId: string;
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UserDTO> {
    const existingUser = await this.userRepository.findById(input.organizationId, input.userId);

    if (!existingUser) {
      throw new NotFoundError('User');
    }

    if (input.role) {
      const validRoles = Object.values(Role);
      if (!validRoles.includes(input.role as Role)) {
        throw new ValidationError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
      }
    }

    let passwordHash = existingUser.passwordHash;
    if (input.password) {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    const now = Date.now();

    const updatedUser = new User({
      id: existingUser.id,
      organizationId: existingUser.organizationId,
      name: input.name ?? existingUser.name,
      email: input.email ?? existingUser.email,
      passwordHash,
      role: (input.role as Role) ?? existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: now,
    });

    const saved = await this.userRepository.update(input.organizationId, updatedUser);

    return UserMapper.toDTO(saved);
  }
}
