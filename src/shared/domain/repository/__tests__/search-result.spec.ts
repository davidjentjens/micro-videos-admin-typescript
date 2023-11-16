import { SearchResult } from '../search-result'
describe('SearchResult Unit Tests', () => {
  test('constructor props', () => {
    let result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      currentPage: 1,
      perPage: 2
    })

    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      currentPage: 1,
      perPage: 2,
      last_page: 2
    })

    result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      currentPage: 1,
      perPage: 2
    })

    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      currentPage: 1,
      perPage: 2,
      last_page: 2
    })
  })
  it('should set last_page = 1 when perPage field is greater than total field', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 4,
      currentPage: 1,
      perPage: 15
    })

    expect(result.last_page).toBe(1)
  })
  test('last_page prop when total is not a multiple of perPage', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 101,
      currentPage: 1,
      perPage: 20
    })

    expect(result.last_page).toBe(6)
  })
})
