import isEqual from 'lodash/isEqual';

export abstract class ValueObject {
    // DUVIDA: Por que apenas o método equals() é abstrato?
    public equals(vo?: ValueObject): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }

        if (vo.constructor.name !== this.constructor.name) {
            return false;
        }

        return isEqual(this, vo);
    }
}
