/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { type Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import {
    CategorySearchResult,
    type CategorySearchParams,
    type ICategoryRepository,
} from '../../../domain/category.repository';
import { type CategoryModel } from './category.model';
import { CategoryModelMapper } from './category-model-mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ['name', 'createdAt'];

    constructor(private readonly categoryModel: typeof CategoryModel) {}

    create!: (category: Category) => Promise<void>;

    find!: (categoryId: Uuid) => Promise<Category | null>;

    async insert(entity: Category): Promise<void> {
        const model = CategoryModelMapper.toModel(entity);
        await this.categoryModel.create(model.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        const models = entities.map((entity) =>
            CategoryModelMapper.toModel(entity).toJSON(),
        );
        await this.categoryModel.bulkCreate(models);
    }

    async update(entity: Category): Promise<void> {
        const id = entity.categoryId.id;
        const model = await this._get(id);
        if (model === null) {
            throw new NotFoundError(id, this.getEntity());
        }
        const newModel = CategoryModelMapper.toModel(entity);
        await model.update(newModel.toJSON(), { where: { categoryId: id } });
    }

    async delete(categoryId: Uuid): Promise<void> {
        const id = categoryId.id;
        const model = await this._get(id);
        if (model === null) {
            throw new NotFoundError(id, this.getEntity());
        }
        await model.destroy();
    }

    async findById(categoryId: Uuid): Promise<Category | null> {
        const model = await this.categoryModel.findByPk(categoryId.id);
        return model ? CategoryModelMapper.toEntity(model) : null;
    }

    private async _get(id: string): Promise<CategoryModel | null> {
        return await this.categoryModel.findByPk(id);
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        return models.map((model) => {
            return CategoryModelMapper.toEntity(model);
        });
    }

    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page - 1) * props.perPage;
        const limit = props.perPage;
        const { rows: models, count } =
            await this.categoryModel.findAndCountAll({
                ...(props.filter && {
                    where: {
                        name: { [Op.like]: `%${props.filter}%` },
                    },
                }),
                ...(props.sort && this.sortableFields.includes(props.sort)
                    ? { order: [[props.sort, props.sortDir!]] }
                    : { order: [['createdAt', 'desc']] }),
                offset,
                limit,
            });
        return new CategorySearchResult({
            items: models.map((model) => {
                return CategoryModelMapper.toEntity(model);
            }),
            total: count,
            currentPage: props.page,
            perPage: props.perPage,
        });
    }

    getEntity(): new (...args: any[]) => Category {
        return Category;
    }
}
