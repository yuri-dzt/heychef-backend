import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../shared/config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        organizationId?: string;
        role?: string;
        type: 'admin' | 'user';
      };
    }
  }
}

interface JwtPayload {
  id: string;
  organizationId?: string;
  role?: string;
  type: 'admin' | 'user';
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
      type: decoded.type,
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const RestaurantOnlyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.type === 'admin') {
    res.status(403).json({ message: 'This endpoint is for restaurant users only' });
    return;
  }
  next();
};
