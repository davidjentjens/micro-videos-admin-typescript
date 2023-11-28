import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export interface SearchParamsConstructorProps<Filter = string> {
    page?: number;
    perPage?: number;
    sort?: string | null;
    sortDir?: SortDirection | null;
    filter?: Filter | null;
}

export class SearchParams<Filter = string> extends ValueObject {
    protected _page: number = 1;
    protected _perPage: number = 15;
    protected _sort: string | null = null;
    protected _sortDir: SortDirection | null = null;
    protected _filter: Filter | null = null;

    constructor({
        page: propsPage = 1,
        perPage: propsPerPage = 15,
        sort: propsSort = null,
        sortDir: propsSortDir = null,
        filter: propsFilter = null,
    }: SearchParamsConstructorProps<Filter> = {}) {
        super();
        this.page = propsPage;
        this.perPage = propsPerPage;
        this.sort = propsSort;
        this.sortDir = propsSortDir;
        this.filter = propsFilter;
    }

    get page(): number {
        return this._page;
    }

    private set page(value: number) {
        let _page = +value;
        if (
            Number.isNaN(_page) ||
            _page <= 0 ||
            parseInt(_page as any) !== _page
        ) {
            _page = 1;
        }
        this._page = _page;
    }

    get perPage(): number {
        return this._perPage;
    }

    private set perPage(value: number) {
        let _perPage = value === (true as any) ? this._perPage : +value;
        if (
            Number.isNaN(_perPage) ||
            _perPage <= 0 ||
            parseInt(_perPage as any) !== _perPage
        ) {
            _perPage = this._perPage;
        }
        this._perPage = _perPage;
    }

    get sort(): string | null {
        return this._sort;
    }

    private set sort(value: string | null) {
        this._sort =
            value === null || value === undefined || value === ''
                ? null
                : `${value}`;
    }

    get sortDir(): SortDirection | null {
        return this._sortDir;
    }

    private set sortDir(value: SortDirection | null) {
        if (this.sort == null) {
            this._sortDir = null;
            return;
        }
        const dir = `${value}`.toLowerCase();
        this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
    }

    get filter(): Filter | null {
        return this._filter;
    }

    protected set filter(value: Filter | null) {
        this._filter =
            value === null || value === undefined || (value as unknown) === ''
                ? null
                : // NOTE: This might create a problem
                  (value.toString() as any);
    }
}
