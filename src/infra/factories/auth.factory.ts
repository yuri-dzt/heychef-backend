import { RegisterUseCase } from '../../app/auth/register.use-case';
import { LoginUseCase } from '../../app/auth/login.use-case';
import { GetMeUseCase } from '../../app/auth/get-me.use-case';
import { AuthController } from '../controllers/auth.controller';
import { PrismaUserRepository } from '../repositories/user.repository';
import { PrismaOrganizationRepository } from '../repositories/organization.repository';

export function makeAuthController(): AuthController {
  const userRepo = new PrismaUserRepository();
  const orgRepo = new PrismaOrganizationRepository();

  const registerUseCase = new RegisterUseCase(userRepo, orgRepo);
  const loginUseCase = new LoginUseCase(userRepo);
  const getMeUseCase = new GetMeUseCase(userRepo);

  return new AuthController(registerUseCase, loginUseCase, getMeUseCase);
}
