import { Request, Response, NextFunction } from 'express';
import { getUserSessions, revokeSession, revokeAllSessions, hashToken } from '../../shared/session';

export class SessionController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessions = await getUserSessions(req.user!.id);

      // Use refresh token from header to identify current session
      const refreshToken = req.headers['x-refresh-token'] as string | undefined;
      const currentHash = refreshToken ? hashToken(refreshToken) : '';

      const data = sessions.map((s) => ({
        id: s.id,
        deviceInfo: s.device_info,
        ipAddress: s.ip_address,
        lastActiveAt: Number(s.last_active_at),
        createdAt: Number(s.created_at),
        isCurrent: s.token_hash === currentHash,
      }));

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  revoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const success = await revokeSession(id, req.user!.id);
      if (!success) {
        res.status(404).json({ message: 'Session not found' });
        return;
      }
      res.status(200).json({ data: { message: 'Session revoked' } });
    } catch (error) {
      next(error);
    }
  };

  revokeAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.headers['x-refresh-token'] as string | undefined;
      const currentHash = refreshToken ? hashToken(refreshToken) : undefined;

      await revokeAllSessions(req.user!.id, currentHash);
      res.status(200).json({ data: { message: 'All other sessions revoked' } });
    } catch (error) {
      next(error);
    }
  };
}
