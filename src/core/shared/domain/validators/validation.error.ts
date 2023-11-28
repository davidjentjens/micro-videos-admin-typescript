/* eslint-disable n/handle-callback-err */
import { type FieldsErrors } from './validator-fields-interface'

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor (public error: FieldsErrors[], message = 'Entity Validation Error') {
    super(message)
  }

  count (): number {
    return Object.keys(this.error).length
  }
}