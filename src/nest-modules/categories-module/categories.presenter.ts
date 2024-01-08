import { Transform } from 'class-transformer';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';

export class CategoryPresenter {
    id: string;
    name: string;
    description?: string | null;
    @Transform(({ value }) => value.toISOString())
    createdAt: Date;

    constructor(output: CategoryOutput) {
        this.id = output.id;
        this.name = output.name;
        this.description = output.description;
        this.createdAt = output.createdAt;
    }
}
