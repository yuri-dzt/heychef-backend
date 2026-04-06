import { IUserRepository } from '../../contracts/user';
import { UserMapper } from '../../contracts/user';
import { NotFoundError } from '../../shared/errors';
import { UserDTO } from '../../contracts/user/dto';

interface GetMeInput {
  userId: string;
  organizationId: string;
}

export class GetMeUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: GetMeInput): Promise<UserDTO> {
    const user = await this.userRepository.findById(input.organizationId, input.userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    return UserMapper.toDTO(user);
  }
}
