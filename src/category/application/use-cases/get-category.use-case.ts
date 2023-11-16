import { type IUseCase } from '../../../shared/application/use-case.interface'
import { NotFoundError } from '../../../shared/domain/errors/not-found.error'
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo'
import { Category } from '../../domain/category.entity'
import { type ICategoryRepository } from '../../domain/category.repository'
import { CategoryOutputMapper, type CategoryOutput } from './common/category-output'

export interface GetCategoryInput {
  id: string
}

export type GetCategoryOutput = CategoryOutput

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {
  constructor (private readonly categoryRepo: ICategoryRepository) {}
  async execute (input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.id)
    const category = await this.categoryRepo.findById(uuid)

    if (category == null) {
      throw new NotFoundError(input.id, Category)
    }

    return CategoryOutputMapper.toOutput(category)
  }
}
