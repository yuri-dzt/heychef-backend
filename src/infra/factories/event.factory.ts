import { EventController } from '../controllers/event.controller';

export function makeEventController(): EventController {
  return new EventController();
}
