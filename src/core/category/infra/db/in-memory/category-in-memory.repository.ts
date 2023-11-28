import { type SortDirection } from '../../../../shared/domain/repository/search-params';
import { type Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Category } from '../../../domain/category.entity';
import {
    type CategoryFilter,
    type ICategoryRepository,
} from '../../../domain/category.repository';

export class CategoryInMemoryRepository
    extends InMemorySearchableRepository<Category, Uuid>
    implements ICategoryRepository
{
    sortableFields: string[] = ['name', 'createdAt'];

    protected async applyFilter(
        items: Category[],
        filter: CategoryFilter | null,
    ): Promise<Category[]> {
        if (filter == null) {
            return items;
        }

        return items.filter((i) => {
            return i.name.toLowerCase().includes(filter.toLowerCase());
        });
    }

    protected applySort(
        items: Category[],
        sort: string | null,
        sortDir: SortDirection | null,
    ) {
        return sort != null
            ? super.applySort(items, sort, sortDir)
            : super.applySort(items, 'createdAt', 'desc');
    }

    getEntity(): new (...args: Category[]) => Category {
        // DUVIDA: Parece que esta sendo retornado um type aqui, mas não entendi o porquê.
        return Category;
    }
}
