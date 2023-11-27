import { Notification } from './validators/notification'
import { type ValueObject } from './value-object'

export abstract class Entity {
  notification: Notification = new Notification()

  abstract get entityId (): ValueObject
  abstract toJSON (): any
}
