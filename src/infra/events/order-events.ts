import { EventEmitter } from 'events';
import { Response } from 'express';
import { OrderDTO } from '../../contracts/order';

class OrderEventEmitter {
  private emitter = new EventEmitter();
  private connections = new Map<string, Set<Response>>();

  subscribe(orgId: string, res: Response): void {
    if (!this.connections.has(orgId)) {
      this.connections.set(orgId, new Set());
    }
    this.connections.get(orgId)!.add(res);
  }

  unsubscribe(orgId: string, res: Response): void {
    const set = this.connections.get(orgId);
    if (set) {
      set.delete(res);
      if (set.size === 0) {
        this.connections.delete(orgId);
      }
    }
  }

  emitNewOrder(order: OrderDTO): void {
    this.sendToOrg(order.organizationId, 'new-order', order);
  }

  emitStatusChange(order: OrderDTO): void {
    this.sendToOrg(order.organizationId, 'order-status-change', order);
  }

  emitCallWaiter(orgId: string, data: unknown): void {
    this.sendToOrg(orgId, 'call-waiter', data);
  }

  emitCallWaiterResolved(orgId: string, data: unknown): void {
    this.sendToOrg(orgId, 'call-waiter-resolved', data);
  }

  private sendToOrg(orgId: string, event: string, data: unknown): void {
    const set = this.connections.get(orgId);
    if (!set) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

    for (const res of set) {
      res.write(payload);
    }
  }
}

export const orderEvents = new OrderEventEmitter();
