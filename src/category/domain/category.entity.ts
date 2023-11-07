import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
    categoryId?: Uuid;
    name: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date;
};

export type CategoryCreateCommand = {
    name: string;
    description?: string | null;
    isActive?: boolean;
};

export class Category { // Vernon, Evans: "An entity does not have to validate its own invariants. It can delegate that to a domain service."
    categoryId: Uuid;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;

    constructor(props: CategoryConstructorProps) {
        this.categoryId = props.categoryId ?? new Uuid();
        this.name = props.name;
        this.description = props.description ?? null;
        this.isActive = props.isActive ?? true;
        this.createdAt = props.createdAt ?? new Date();
    }

    static create(props: CategoryConstructorProps): Category {
        const category = new Category(props);
        Category.validate(category);
        return category;
    }

    changeName(name: string): void {
        this.name = name;
    }

    changeDescription(description: string): void {
        this.description = description;
    }

    activate(): void {
        this.isActive = true;
    }

    deactivate(): void {
        this.isActive = false;
    }

    static validate(entity: Category) {
        const validator = CategoryValidatorFactory.create();
        return validator.validate(entity);
    }

    toJSON() {
        return {
            categoryId: this.categoryId.id,
            name: this.name,
            description: this.description,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}
