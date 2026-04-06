import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../app/auth/register.use-case';
import { LoginUseCase } from '../../app/auth/login.use-case';
import { GetMeUseCase } from '../../app/auth/get-me.use-case';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private getMeUseCase: GetMeUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = registerSchema.parse(req.body);

      const user = await this.registerUseCase.execute({
        name: body.name,
        email: body.email,
        password: body.password,
        organizationName: body.organizationName,
      });

      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = loginSchema.parse(req.body);

      const result = await this.loginUseCase.execute({
        email: body.email,
        password: body.password,
        organizationId: body.organizationId,
      });

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.getMeUseCase.execute({
        userId: req.user!.id,
        organizationId: req.user!.organizationId,
      });

      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };
}
