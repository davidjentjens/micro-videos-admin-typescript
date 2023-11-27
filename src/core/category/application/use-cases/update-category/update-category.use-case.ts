import { type IUseCase } from '../../../../shared/application/use-case.interface'
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error'
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo'
import { Category } from '../../../domain/category.entity'
import { type ICategoryRepository } from '../../../domain/category.repository'
import { CategoryOutputMapper, type CategoryOutput } from '../common/category-output'
import { type UpdateCategoryInput } from './update-category.input'

export type UpdateCategoryOutput = CategoryOutput

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor (private readonly categoryRepo: ICategoryRepository) {}

  async execute (input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id)
    const category = await this.categoryRepo.findById(uuid)

    if (category == null) {
      throw new NotFoundError(input.id, Category)
    }

    input.name && category.changeName(input.name)

    if ('description' in input) {
      category.changeDescription(input.description)
    }

    if (input.isActive === true) {
      category.activate()
    }

    if (input.isActive === false) {
      category.deactivate()
    }

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON())
    }

    await this.categoryRepo.update(category)

    return CategoryOutputMapper.toOutput(category)
  }
}
