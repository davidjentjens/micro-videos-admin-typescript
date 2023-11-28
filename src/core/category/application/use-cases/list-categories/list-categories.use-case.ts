import {
    type PaginationOutput,
    PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { type IUseCase } from '../../../../shared/application/use-case.interface';
import { type SortDirection } from '../../../../shared/domain/repository/search-params';
import {
    type CategoryFilter,
    CategorySearchParams,
    type CategorySearchResult,
    type ICategoryRepository,
} from '../../../domain/category.repository';
import {
    type CategoryOutput,
    CategoryOutputMapper,
} from '../common/category-output';

export interface ListCategoriesInput {
    page?: number;
    perPage?: number;
    sort?: string | null;
    sortDir?: SortDirection | null;
    filter?: CategoryFilter | null;
}

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase
    implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
    constructor(private readonly categoryRepo: ICategoryRepository) {}

    private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
        const { items: _items } = searchResult;
        const items = _items.map((i) => {
            return CategoryOutputMapper.toOutput(i);
        });
        return PaginationOutputMapper.toOutput(items, searchResult);
    }

    async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
        const params = new CategorySearchParams(input);
        const searchResult = await this.categoryRepo.search(params);
        return this.toOutput(searchResult);
    }
}
