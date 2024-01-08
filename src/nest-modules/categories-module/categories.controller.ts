import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-categories/list-categories.use-case';
import { CategoryPresenter } from './categories.presenter';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';

@Controller('categories')
export class CategoriesController {
    // NOTE: The two ways of injecting dependencies are equivalent, but the second one is more concise, since the class
    // name is already registered in the container.
    // @Inject(CATEGORY_PROVIDERS.USE_CASES.CREATE_CATEGORY_USE_CASE)
    @Inject(CreateCategoryUseCase)
    private createUseCase: CreateCategoryUseCase;

    @Inject(UpdateCategoryUseCase)
    private updateUseCase: UpdateCategoryUseCase;

    @Inject(DeleteCategoryUseCase)
    private deleteUseCase: DeleteCategoryUseCase;

    @Inject(GetCategoryUseCase)
    private getUseCase: GetCategoryUseCase;

    @Inject(ListCategoriesUseCase)
    private listUseCase: ListCategoriesUseCase;

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const output = await this.createUseCase.execute(createCategoryDto);
        return CategoriesController.serialize(output);
    }

    @Get()
    findAll() {}

    @Get(':id')
    findOne(@Param('id') id: string) {}

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {}

    @Delete(':id')
    remove(@Param('id') id: string) {}

    static serialize(output: CategoryOutput) {
        return new CategoryPresenter(output);
    }
}
