import { ValueObject } from '../value-object';
// Quebra parcial da arquitetura purista, pois o uuidv4 é uma dependência externa
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class Uuid extends ValueObject {
    readonly id: string;

    constructor(id?: string) {
        super();
        this.id = id ?? uuidv4();
        this.validate();
    }

    private validate(): void {
        const isValid = uuidValidate(this.id);
        if (!isValid) {
            throw new InvalidUuidError();
        }
    }

    toString(): string {
        return this.id;
    }
}

export class InvalidUuidError extends Error {
    constructor(message?: string) {
        super(message ?? 'ID must be a valid UUID');
        this.name = 'InvalidUuidError';
    }
}
