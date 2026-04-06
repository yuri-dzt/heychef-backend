import { IUserRepository } from '../../contracts/user';
import { NotFoundError } from '../../shared/errors';

interface DeleteUserInput {
  organizationId: string;
  userId: string;
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const existingUser = await this.userRepository.findById(input.organizationId, input.userId);

    if (!existingUser) {
      throw new NotFoundError('User');
    }

    await this.userRepository.delete(input.organizationId, input.userId);
  }
}
