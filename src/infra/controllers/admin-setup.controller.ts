import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../shared/prisma';
import { config } from '../../shared/config';

export class AdminSetupController {
  setup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { secretKey, name, email, password } = req.body;

      if (!config.setupSecretKey) {
        res.status(500).json({ message: 'Setup não configurado no servidor' });
        return;
      }

      if (!secretKey || secretKey !== config.setupSecretKey) {
        res.status(401).json({ message: 'Chave secreta inválida' });
        return;
      }

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        return;
      }

      if (password.length < 4) {
        res.status(400).json({ message: 'Senha deve ter pelo menos 4 caracteres' });
        return;
      }

      const existingAdmin = await prisma.admin.findFirst();
      if (existingAdmin) {
        res.status(409).json({ message: 'Já existe um administrador configurado' });
        return;
      }

      const hash = await bcrypt.hash(password, 10);
      await prisma.admin.create({
        data: {
          id: uuidv4(),
          name,
          email,
          password_hash: hash,
          created_at: BigInt(Date.now()),
        },
      });

      res.status(201).json({ data: { message: 'Administrador criado com sucesso' } });
    } catch (error) {
      next(error);
    }
  };
}
