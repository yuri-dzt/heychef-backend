import { Request, Response, NextFunction } from 'express';
import { orderEvents } from '../events/order-events';

export class EventController {
  subscribeOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.user!.organizationId!;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      orderEvents.subscribe(orgId, res);

      req.on('close', () => {
        orderEvents.unsubscribe(orgId, res);
      });
    } catch (error) {
      next(error);
    }
  };
}
