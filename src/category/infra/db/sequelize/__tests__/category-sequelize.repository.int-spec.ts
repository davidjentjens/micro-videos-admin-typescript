import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error'
import { CategoryModelMapper } from '../category-model-mapper'
import { CategorySearchParams, CategorySearchResult } from '../../../../domain/category.repository'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe('CategorySequelizeRepository Integration Test', () => {
  let repository: CategorySequelizeRepository
  setupSequelize({ models: [CategoryModel] })

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  it('should insert a new entity', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    const entity = await repository.findById(category.categoryId)
    expect(entity!.toJSON()).toStrictEqual(category.toJSON())
  })

  it('should find entity by id', async () => {
    let entityFound = await repository.findById(new Uuid())
    expect(entityFound).toBeNull()

    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    entityFound = await repository.findById(entity.categoryId)
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON())
  })

  it('should return all categories', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    const entities = await repository.findAll()
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  })

  it('should throw error on update when an entity is not found', async () => {
    const entity = Category.fake().aCategory().build()
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.categoryId.id, Category)
    )
  })

  it('should update an entity', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    entity.changeName('Movie updated')
    await repository.update(entity)
    const entityFound = await repository.findById(entity.categoryId)
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON())
  })

  it('should throw error on delete when an entity is not found', async () => {
    const categoryId = new Uuid()
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    )
  })

  it('should delete an entity', async () => {
    const entity = new Category({ name: 'Movie' })
    await repository.insert(entity)
    await repository.delete(entity.categoryId)
    await expect(repository.findById(entity.categoryId)).resolves.toBeNull()
  })

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const createdAt = new Date()
      const categories = Category.fake()
        .theCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build()

      // TODO: Replace with bulkInsert
      await repository.insert(categories[0])
      await repository.insert(categories[1])
      await repository.insert(categories[2])
      await repository.insert(categories[3])
      await repository.insert(categories[4])
      await repository.insert(categories[5])
      await repository.insert(categories[6])
      await repository.insert(categories[7])
      await repository.insert(categories[8])
      await repository.insert(categories[9])
      await repository.insert(categories[10])
      await repository.insert(categories[11])
      await repository.insert(categories[12])
      await repository.insert(categories[13])
      await repository.insert(categories[14])
      await repository.insert(categories[15])

      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')
      const searchOutput = await repository.search(new CategorySearchParams())

      expect(searchOutput).toBeInstanceOf(CategorySearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15
      })
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category)
        expect(item.categoryId).toBeDefined()
      })
      const items = searchOutput.items.map((item) => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          isActive: true,
          createdAt
        })
      )
    })

    it('should order by createdAt DESC when search params are null', async () => {
      const createdAt = new Date()
      const categories = Category.fake()
        .theCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build()
      const searchOutput = await repository.search(new CategorySearchParams())
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`${item.name}`).toBe(`${categories[index + 1].name}`)
      })
    })

    it('should apply paginate and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build()
      ]

      // TODO: Replace with bulkInsert
      await repository.insert(categories[0])
      await repository.insert(categories[1])
      await repository.insert(categories[2])
      await repository.insert(categories[3])

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          perPage: 2,
          filter: 'TEST'
        })
      )

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          currentPage: 1,
          perPage: 2
        }).toJSON(true)
      )
      searchOutput = await repository.search(
        new CategorySearchParams({
          page: 2,
          perPage: 2,
          filter: 'TEST'
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          currentPage: 2,
          perPage: 2
        }).toJSON(true)
      )
    })

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'createdAt'])
      const categories = [
        Category.fake().aCategory().withName('b').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('d').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('c').build()
      ]

      // TODO: Replace with bulkInsert
      await repository.insert(categories[0])
      await repository.insert(categories[1])
      await repository.insert(categories[2])
      await repository.insert(categories[3])
      await repository.insert(categories[4])

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name'
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            currentPage: 1,
            perPage: 2
          })
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name'
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            currentPage: 2,
            perPage: 2
          })
        },
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc'
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            currentPage: 1,
            perPage: 2
          })
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc'
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            currentPage: 2,
            perPage: 2
          })
        }
      ]
      for (const i of arrange) {
        const result = await repository.search(i.params)
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true))
      }
    })

    describe('should search using filter, sort and paginate', () => {
      const categories = [
        Category.fake().aCategory().withName('test').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('TEST').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('TeSt').build()
      ]
      const arrange = [
        {
          searchParams: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'TEST'
          }),
          searchResult: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2
          })
        },
        {
          searchParams: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'TEST'
          }),
          searchResult: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2
          })
        }
      ]

      beforeEach(async () => {
        // await repository.bulkInsert(categories)
        // TODO: Replace with bulkInsert
        await repository.insert(categories[0])
        await repository.insert(categories[1])
        await repository.insert(categories[2])
        await repository.insert(categories[3])
        await repository.insert(categories[4])
      })

      test.each(arrange)(
        'when value is $search_params',
        async ({ searchParams, searchResult }) => {
          const result = await repository.search(searchParams)
          expect(result.toJSON(true)).toMatchObject(searchResult.toJSON(true))
        }
      )
    })
  })
})
