import { type Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import {
    type IRepository,
    type ISearchableRepository,
} from '../../../domain/repository/repository-interface';
import {
    type SearchParams,
    type SortDirection,
} from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { type ValueObject } from '../../../domain/value-object';

export abstract class InMemoryRepository<
    E extends Entity,
    EntityID extends ValueObject,
> implements IRepository<E, EntityID>
{
    items: E[] = [];

    async insert(entity: E): Promise<void> {
        this.items.push(entity);
    }

    async bulkInsert(entities: E[]): Promise<void> {
        this.items.push(...entities);
    }

    async update(entity: E): Promise<void> {
        const indexFound = this.items.findIndex((item) =>
            item.entityId.equals(entity.entityId),
        );
        if (indexFound === -1) {
            throw new NotFoundError(entity.entityId, this.getEntity());
        }
        this.items[indexFound] = entity;
    }

    async delete(entityId: EntityID): Promise<void> {
        const indexFound = this.items.findIndex((item) =>
            item.entityId.equals(entityId),
        );
        if (indexFound === -1) {
            throw new NotFoundError(entityId, this.getEntity());
        }
        this.items.splice(indexFound, 1);
    }

    async findById(entityId: EntityID): Promise<E | null> {
        const entity = this.items.find((item) =>
            item.entityId.equals(entityId),
        );
        return typeof entity === 'undefined' ? null : entity;
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }

    // DUVIDA: Por que não é possível usar o método getEntity() aqui? Por que precisa ser implementado na classe filha?
    abstract getEntity(): new (...args: E[]) => E;
}

export abstract class InMemorySearchableRepository<
        E extends Entity,
        EntityID extends ValueObject,
        Filter = string,
    >
    extends InMemoryRepository<E, EntityID>
    implements ISearchableRepository<E, EntityID, Filter>
{
    sortableFields: string[] = [];

    async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
        const itemsFiltered = await this.applyFilter(this.items, props.filter);
        const itemsSorted = this.applySort(
            itemsFiltered,
            props.sort,
            props.sortDir,
        );
        const itemsPaginated = this.applyPaginate(
            itemsSorted,
            props.page,
            props.perPage,
        );
        return new SearchResult({
            items: itemsPaginated,
            total: itemsFiltered.length,
            currentPage: props.page,
            perPage: props.perPage,
        });
    }

    protected abstract applyFilter(
        items: E[],
        filter: Filter | null,
    ): Promise<E[]>;

    protected applyPaginate(
        items: E[],
        page: SearchParams['page'],
        perPage: SearchParams['perPage'],
    ): E[] {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return items.slice(start, end);
    }

    protected applySort(
        items: E[],
        sort: string | null,
        sortDir: SortDirection | null,
        customGetter?: (sort: string, item: E) => any,
    ): E[] {
        if (sort === null || !this.sortableFields.includes(sort)) {
            return items;
        }

        return [...items].sort((a, b) => {
            const valueA =
                customGetter != null ? customGetter(sort, a) : (a as any)[sort];
            const valueB =
                customGetter != null ? customGetter(sort, b) : (b as any)[sort];

            if (valueA < valueB) {
                return sortDir === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDir === 'asc' ? 1 : -1;
            }

            return 0;
        });
    }
}
