import { IUserRepository } from '../../contracts/user';
import { UserMapper } from '../../contracts/user';
import { UserDTO } from '../../contracts/user/dto';

interface ListUsersInput {
  organizationId: string;
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<UserDTO[]> {
    const users = await this.userRepository.findAllByOrg(input.organizationId);
    return users.map(UserMapper.toDTO);
  }
}
