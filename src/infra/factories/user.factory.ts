import { ListUsersUseCase } from '../../app/user/list-users.use-case';
import { CreateUserUseCase } from '../../app/user/create-user.use-case';
import { UpdateUserUseCase } from '../../app/user/update-user.use-case';
import { DeleteUserUseCase } from '../../app/user/delete-user.use-case';
import { UserController } from '../controllers/user.controller';
import { PrismaUserRepository } from '../repositories/user.repository';

export function makeUserController(): UserController {
  const userRepo = new PrismaUserRepository();

  const listUsersUseCase = new ListUsersUseCase(userRepo);
  const createUserUseCase = new CreateUserUseCase(userRepo);
  const updateUserUseCase = new UpdateUserUseCase(userRepo);
  const deleteUserUseCase = new DeleteUserUseCase(userRepo);

  return new UserController(listUsersUseCase, createUserUseCase, updateUserUseCase, deleteUserUseCase);
}
