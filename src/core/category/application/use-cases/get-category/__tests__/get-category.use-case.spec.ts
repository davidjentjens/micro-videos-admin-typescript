import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
    InvalidUuidError,
    Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { GetCategoryUseCase } from '../get-category.use-case';
describe('GetCategoryUseCase Unit Tests', () => {
    let useCase: GetCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new GetCategoryUseCase(repository);
    });

    it('should throw error when entity is not found', async () => {
        await expect(
            async () => await useCase.execute({ id: 'fake id' }),
        ).rejects.toThrow(new InvalidUuidError());
        const uuid = new Uuid();
        await expect(
            async () => await useCase.execute({ id: uuid.id }),
        ).rejects.toThrow(new NotFoundError(uuid.id, Category));
    });

    it('should return a category', async () => {
        const items = [Category.create({ name: 'Movie' })];
        repository.items = items;
        const spyFindById = jest.spyOn(repository, 'findById');
        const output = await useCase.execute({ id: items[0].categoryId.id });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: items[0].categoryId.id,
            name: 'Movie',
            description: null,
            isActive: true,
            createdAt: items[0].createdAt,
        });
    });
});
