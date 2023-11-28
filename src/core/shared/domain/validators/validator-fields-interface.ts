import { type Notification } from './notification';

export type FieldsErrors = Record<string, string[]> | string;

export interface IValidatorFields {
    validate: (
        notification: Notification,
        data: any,
        fields: string[],
    ) => boolean;
}
