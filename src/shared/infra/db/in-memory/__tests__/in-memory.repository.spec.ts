import { Entity } from '../../../../domain/entity'
import { NotFoundError } from '../../../../domain/errors/not-found.error'
import { Uuid } from '../../../../domain/value-objects/uuid.vo'
import { InMemoryRepository } from '../in-memory.repository'

interface StubEntityConstructor {
  entityId?: Uuid
  name?: string
  price?: number
}

// NOTA: Arrange, Act, Assert
class StubEntity extends Entity {
  entityId: Uuid
  name?: string
  price?: number

  constructor (props: StubEntityConstructor) {
    super()
    this.entityId = props.entityId ?? new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON (): any {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price
    }
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity (): new (...args: StubEntity[]) => StubEntity {
    return StubEntity
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository

  beforeEach(() => {
    repository = new StubInMemoryRepository()
  })

  it('should insert an entity', async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      name: 'Test',
      price: 100
    })

    await repository.insert(entity)

    expect(repository.items.length).toBe(1)
    expect(repository.items[0]).toBe(entity)
  })

  it('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        name: 'Test',
        price: 100
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: 'Test 2',
        price: 200
      })
    ]

    await repository.bulkInsert(entities)

    expect(repository.items.length).toBe(2)
    expect(repository.items[0]).toBe(entities[0])
    expect(repository.items[1]).toBe(entities[1])
  })

  it('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)

    const entities = await repository.findAll()

    expect(entities).toStrictEqual([entity])
  })

  it('should throw an error on update when entity not found', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })

    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity)
    )
  })

  it('should update an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)
    const entityUpdated = new StubEntity({
      entityId: entity.entityId,
      name: 'updated',
      price: 1
    })

    await repository.update(entityUpdated)

    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON())
  })

  it('should throw an error on delete when entity not found', async () => {
    const uuid = new Uuid()

    await expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity)
    )

    await expect(
      repository.delete(new Uuid('9366b7dc-2d71-4799-b91c-c64adb205104'))
    ).rejects.toThrow(
      new NotFoundError('9366b7dc-2d71-4799-b91c-c64adb205104', StubEntity)
    )
  })

  it('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)

    await repository.delete(entity.entityId)

    expect(repository.items).toHaveLength(0)
  })
})
