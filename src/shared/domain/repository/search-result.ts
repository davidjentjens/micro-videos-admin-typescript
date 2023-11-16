import { type Entity } from '../entity'
import { ValueObject } from '../value-object'

interface SearchResultConstructorProps<E extends Entity> {
  items: E[]
  total: number
  currentPage: number
  perPage: number
}

export class SearchResult<A extends Entity = Entity> extends ValueObject {
  readonly items: A[]
  readonly total: number
  readonly currentPage: number
  readonly perPage: number
  readonly last_page: number

  constructor (props: SearchResultConstructorProps<A>) {
    super()
    this.items = props.items
    this.total = props.total
    this.currentPage = props.currentPage
    this.perPage = props.perPage
    this.last_page = Math.ceil(this.total / this.perPage)
  }

  toJSON (forceEntity = false): any {
    return {
      items: forceEntity
        ? this.items.map((item) => item.toJSON())
        : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      last_page: this.last_page
    }
  }
}
