import { ListCategoriesUseCase } from '../list-categories.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category } from '../../../../domain/category.entity';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CategoryOutputMapper } from '../../common/category-output';

describe('ListCategoriesUseCase Integration Tests', () => {
    let useCase: ListCategoriesUseCase;
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new ListCategoriesUseCase(repository);
    });

    it('should return output sorted by created_at when input param is empty', async () => {
        const categories = Category.fake()
            .theCategories(2)
            .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
            .build();
        await repository.bulkInsert(categories);

        const output = await useCase.execute({});

        expect(output).toEqual({
            items: [...categories].reverse().map(CategoryOutputMapper.toOutput),
            total: 2,
            currentPage: 1,
            perPage: 15,
            lastPage: 1,
        });
    });

    it('should returns output using pagination, sort and filter', async () => {
        const categories = [
            new Category({ name: 'a' }),
            new Category({
                name: 'AAA',
            }),
            new Category({
                name: 'AaA',
            }),
            new Category({
                name: 'b',
            }),
            new Category({
                name: 'c',
            }),
        ];
        await repository.bulkInsert(categories);

        let output = await useCase.execute({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'a',
        });

        expect(output).toEqual({
            items: [categories[1], categories[2]].map(
                CategoryOutputMapper.toOutput,
            ),
            total: 3,
            currentPage: 1,
            perPage: 2,
            lastPage: 2,
        });

        output = await useCase.execute({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'a',
        });
        expect(output).toEqual({
            items: [categories[0]].map(CategoryOutputMapper.toOutput),
            total: 3,
            currentPage: 2,
            perPage: 2,
            lastPage: 2,
        });
        output = await useCase.execute({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
            filter: 'a',
        });
        expect(output).toEqual({
            items: [categories[0], categories[2]].map(
                CategoryOutputMapper.toOutput,
            ),
            total: 3,
            currentPage: 1,
            perPage: 2,
            lastPage: 2,
        });
    });
});
