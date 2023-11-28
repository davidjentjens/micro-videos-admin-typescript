import { type Category } from '../../../domain/category.entity';

export interface CategoryOutput {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt: Date;
}

export class CategoryOutputMapper {
    static toOutput(entity: Category): CategoryOutput {
        const { categoryId, ...otherProps } = entity.toJSON();

        return {
            id: categoryId,
            ...otherProps,
        };
    }
}
