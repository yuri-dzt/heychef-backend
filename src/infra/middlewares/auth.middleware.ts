import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../shared/config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        organizationId: string;
        role: string;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  organizationId: string;
  role: string;
}

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] || (req.query.token as string);

  if (!token) {
    res.status(401).json({ message: 'Missing or invalid authorization token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    req.user = {
      id: decoded.id,
      organizationId: decoded.organizationId,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
