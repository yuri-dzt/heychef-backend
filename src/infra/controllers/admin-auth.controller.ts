import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../shared/prisma';
import { config } from '../../shared/config';
import { loginSchema } from '../schemas/admin-auth.schema';
import { createSession } from '../../shared/session';

export class AdminAuthController {
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = loginSchema.parse(req.body);

      const admin = await prisma.admin.findFirst({
        where: { email: body.email },
      });

      if (!admin) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const passwordMatch = await bcrypt.compare(body.password, admin.password_hash);

      if (!passwordMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { id: admin.id, type: 'admin' },
        config.jwtSecret,
        { expiresIn: '1h' },
      );

      const refreshToken = uuidv4();

      try {
        const ua = req.headers['user-agent'];
        await createSession({
          userId: admin.id,
          userType: 'admin',
          token: refreshToken,
          deviceInfo: Array.isArray(ua) ? ua[0] : ua,
          ipAddress: req.ip || req.socket.remoteAddress || undefined,
        });
      } catch {
        // Session creation failure should not block login
      }

      res.status(200).json({
        data: {
          token,
          refreshToken,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admin = await prisma.admin.findUnique({
        where: { id: req.user!.id },
      });

      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }

      res.status(200).json({
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
