import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/prisma';
import { config } from '../../shared/config';
import { hashToken } from '../../shared/session';

export class RefreshController {
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token required' });
        return;
      }

      const tokenHash = hashToken(refreshToken);
      const session = await prisma.session.findFirst({
        where: {
          token_hash: tokenHash,
          expires_at: { gt: BigInt(Date.now()) },
        },
      });

      if (!session) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
        return;
      }

      // Update last active
      await prisma.session.update({
        where: { id: session.id },
        data: { last_active_at: BigInt(Date.now()) },
      });

      // Issue new access token
      if (session.user_type === 'admin') {
        const admin = await prisma.admin.findUnique({ where: { id: session.user_id } });
        if (!admin) {
          res.status(401).json({ message: 'User not found' });
          return;
        }
        const token = jwt.sign({ id: admin.id, type: 'admin' }, config.jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ data: { token } });
      } else {
        const user = await prisma.user.findUnique({ where: { id: session.user_id } });
        if (!user) {
          res.status(401).json({ message: 'User not found' });
          return;
        }
        const token = jwt.sign(
          { id: user.id, organizationId: user.organization_id, role: user.role, type: 'user' },
          config.jwtSecret,
          { expiresIn: '1h' },
        );
        res.status(200).json({ data: { token } });
      }
    } catch (error) {
      next(error);
    }
  };
}
