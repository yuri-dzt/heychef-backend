import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../contracts/user';
import { UserMapper } from '../../contracts/user';
import { User, Role } from '../../domain/user';
import { ConflictError, ValidationError } from '../../shared/errors';
import { UserDTO } from '../../contracts/user/dto';

interface CreateUserInput {
  organizationId: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<UserDTO> {
    const validRoles = Object.values(Role);
    if (!validRoles.includes(input.role as Role)) {
      throw new ValidationError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const existingUser = await this.userRepository.findByEmail(input.organizationId, input.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const now = Date.now();

    const user = new User({
      id: uuidv4(),
      organizationId: input.organizationId,
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role as Role,
      createdAt: now,
    });

    const createdUser = await this.userRepository.create(input.organizationId, user);

    return UserMapper.toDTO(createdUser);
  }
}
