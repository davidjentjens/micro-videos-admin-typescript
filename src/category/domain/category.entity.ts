import { Entity } from '../../shared/domain/entity'
import { type ValueObject } from '../../shared/domain/value-object'
import { Uuid } from '../../shared/domain/value-objects/uuid.vo'
import { CategoryFakeBuilder } from './category-fake.builder'
import { CategoryValidatorFactory } from './category.validator'

export interface CategoryConstructorProps {
  categoryId?: Uuid
  name: string
  description?: string | null
  isActive?: boolean
  createdAt?: Date
}

export interface CategoryUpdateProps {
  name: string
  description?: string | null
}

// NOTE: Notification pattern for leaving validation exception handling to the application layer
export class Category extends Entity {
  // NOTE: Vernon, Evans: "An entity does not have to validate its own invariants. It can delegate that to a domain service."

  categoryId: Uuid
  name: string
  description?: string | null
  isActive: boolean
  createdAt: Date

  constructor (props: CategoryConstructorProps) {
    super()
    this.categoryId = props.categoryId ?? new Uuid()
    this.name = props.name
    this.description = props.description ?? null
    this.isActive = props.isActive ?? true
    this.createdAt = props.createdAt ?? new Date()
  }

  get entityId (): ValueObject {
    return this.categoryId
  }

  static create (props: CategoryConstructorProps): Category {
    const category = new Category(props)
    // category.validate();
    category.validate(['name'])
    return category
  }

  update (props: CategoryUpdateProps): void {
    this.name = props.name
    this.description = props.description ?? null
  }

  changeName (name: string): void {
    this.name = name
    this.validate(['name'])
  }

  changeDescription (description?: string | null): void {
    this.description = description
  }

  activate (): void {
    this.isActive = true
  }

  deactivate (): void {
    this.isActive = false
  }

  validate (fields?: string[]): boolean {
    const validator = CategoryValidatorFactory.create()
    return validator.validate(this.notification, this, fields)
  }

  static fake () {
    return CategoryFakeBuilder
  }

  toJSON () {
    return {
      categoryId: this.categoryId.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt
    }
  }
}
