import { type IUseCase } from '../../../shared/application/use-case.interface'
import { EntityValidationError } from '../../../shared/domain/validators/validation.error'
import { Category } from '../../domain/category.entity'
import { type ICategoryRepository } from '../../domain/category.repository'
import { CategoryOutputMapper, type CategoryOutput } from './common/category-output'

export interface CreateCategoryInput {
  name: string
  description?: string | null
  isActive?: boolean
}

export type CreateCategoryOutput = CategoryOutput

export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
  // NOTE: This is dependency injection. We are injecting the repository
  constructor (private readonly categoryRepo: ICategoryRepository) {}

  async execute (input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input)

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON())
    }

    await this.categoryRepo.insert(category)

    // NOTE: This is a DTO (Data Transfer Object). We are returning a DTO instead of the category.
    // Uncle Bob says that we should never return entities from our use cases.
    return CategoryOutputMapper.toOutput(category)
  }
}
