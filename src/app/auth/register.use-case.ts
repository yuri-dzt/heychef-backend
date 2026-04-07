import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../contracts/user';
import { IOrganizationRepository } from '../../contracts/organization';
import { UserMapper } from '../../contracts/user';
import { OrganizationMapper } from '../../contracts/organization';
import { User, Role } from '../../domain/user';
import { Organization } from '../../domain/organization';
import { ConflictError } from '../../shared/errors';
import { UserDTO } from '../../contracts/user/dto';
import { prisma } from '../../shared/prisma';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: RegisterInput): Promise<UserDTO> {
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    const organization = new Organization({
      id: uuidv4(),
      name: input.organizationName,
      planExpiresAt: now + thirtyDaysMs,
      createdAt: now,
    });

    const createdOrg = await this.organizationRepository.create(organization);

    const defaultPages = ['orders', 'menu', 'tables', 'users', 'reports'];
    for (const pageName of defaultPages) {
      await prisma.page.create({
        data: {
          id: uuidv4(),
          organization_id: createdOrg.id,
          name: pageName,
          created_at: BigInt(Date.now()),
        },
      });
    }

    const existingUser = await this.userRepository.findByEmail(createdOrg.id, input.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = new User({
      id: uuidv4(),
      organizationId: createdOrg.id,
      name: input.name,
      email: input.email,
      passwordHash,
      role: Role.ADMIN,
      createdAt: now,
    });

    const createdUser = await this.userRepository.create(createdOrg.id, user);

    return UserMapper.toDTO(createdUser);
  }
}
