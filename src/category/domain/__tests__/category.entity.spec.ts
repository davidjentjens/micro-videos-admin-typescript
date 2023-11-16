import { Uuid } from '../../../shared/domain/value-objects/uuid.vo'
import { Category } from '../category.entity'

describe('Category Unit Tests', () => {
  let validateSpy: any
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate')
  })
  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie'
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.isActive).toBeTruthy()
      expect(category.createdAt).toBeInstanceOf(Date)
    })

    test('should create a category with all values', () => {
      const createdAt = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
        isActive: false,
        createdAt
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.isActive).toBeFalsy()
      expect(category.createdAt).toBe(createdAt)
    })
    test('should create a category with name and description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description'
      })

      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.isActive).toBeTruthy()
      expect(category.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('category create', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie'
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'some description'
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('some description')
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with isActive', () => {
      const category = Category.create({
        name: 'Movie',
        isActive: false
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(false)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('category update', () => {
    it('should update a category', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'some description'
      })
      category.update({
        name: 'Movie 2'
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie 2')
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('categoryId field', () => {
    const arrange = [{ categoryId: null }, { categoryId: undefined }, { categoryId: new Uuid() }]
    test.each(arrange)('id = %j', ({ categoryId }) => {
      const category = new Category({
        name: 'Movie',
        categoryId: categoryId as any
      })
      expect(category.categoryId).toBeInstanceOf(Uuid)
      if (categoryId instanceof Uuid) {
        expect(category.categoryId).toBe(categoryId)
      }
    })
  })

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie'
    })
    category.changeName('other name')
    expect(category.name).toBe('other name')
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie'
    })
    category.changeDescription('some description')
    expect(category.description).toBe('some description')
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test('should activate a category', () => {
    const category = Category.create({
      name: 'Filmes',
      isActive: false
    })
    category.activate()
    expect(category.isActive).toBe(true)
  })

  test('should disable a category', () => {
    const category = Category.create({
      name: 'Filmes',
      isActive: true
    })
    category.deactivate()
    expect(category.isActive).toBe(false)
  })
})

describe('Category Validation', () => {
  describe('category create', () => {
    it('should show errors when an invalid property value is provided', () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })
      expect(() => Category.create({ name: '' })).containsErrorMessages({
        name: ['name should not be empty']
      })
      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })
      expect(() =>
        Category.create({ name: 't'.repeat(256) })
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      })
    })

    it('should show errors when a invalid category description property value is provided', () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessages({
        description: ['description must be a string']
      })
    })
    it('should show errors when a invalid isActive description property value is provided', () => {
      expect(() =>
        Category.create({ isActive: 5 } as any)
      ).containsErrorMessages({
        isActive: ['isActive must be a boolean value']
      })
    })
  })

  describe('category update', () => {
    it('should show errors when an invalid property value is provided', () => {
      const category = Category.create({ name: 'Movie' })
      expect(() => { category.update({ name: null }) }).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })
    })
  })

  describe('changeName method', () => {
    it('should show errors when changing the name of the category to an invalid value', () => {
      const category = Category.create({ name: 'Movie' })
      expect(() => { category.changeName(null) }).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })
      expect(() => { category.changeName('') }).containsErrorMessages({
        name: ['name should not be empty']
      })
      expect(() => { category.changeName(5 as any) }).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })
      expect(() => { category.changeName('t'.repeat(256)) }).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      })
    })
  })

  describe('changeDescription method', () => {
    it('should show errors when changing the description of the category to an invalid value', () => {
      const category = Category.create({ name: 'Movie' })
      expect(() => { category.changeDescription(5 as any) }).containsErrorMessages({
        description: ['description must be a string']
      })
    })
  })
})
