import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../contracts/user';
import { UserMapper } from '../../contracts/user';
import { config } from '../../shared/config';
import { UnauthorizedError } from '../../shared/errors';
import { UserDTO } from '../../contracts/user/dto';

interface LoginInput {
  email: string;
  password: string;
  organizationId?: string;
}

interface LoginOutput {
  token: string;
  refreshToken: string;
  user: UserDTO;
}

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = input.organizationId
      ? await this.userRepository.findByEmail(input.organizationId, input.email)
      : await this.userRepository.findByEmailGlobal(input.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign(
      {
        id: user.id,
        organizationId: user.organizationId,
        role: user.role,
        type: 'user',
      },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    const refreshToken = uuidv4();

    return {
      token,
      refreshToken,
      user: UserMapper.toDTO(user),
    };
  }
}
