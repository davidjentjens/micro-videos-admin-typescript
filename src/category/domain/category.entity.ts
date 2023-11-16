import { Entity } from '../../shared/domain/entity'
import { EntityValidationError } from '../../shared/domain/validators/validation.error'
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

export class Category extends Entity {
  // Vernon, Evans: "An entity does not have to validate its own invariants. It can delegate that to a domain service."

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
    Category.validate(category)
    return category
  }

  update (props: CategoryUpdateProps): void {
    this.name = props.name
    this.description = props.description ?? null
    Category.validate(this)
  }

  changeName (name: string): void {
    this.name = name
    Category.validate(this)
  }

  changeDescription (description?: string | null): void {
    this.description = description
    Category.validate(this)
  }

  activate (): void {
    this.isActive = true
  }

  deactivate (): void {
    this.isActive = false
  }

  static validate (entity: Category): void {
    const validator = CategoryValidatorFactory.create()
    const isValid = validator.validate(entity)
    if (!isValid) {
      throw new EntityValidationError(validator.errors!)
    }
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
