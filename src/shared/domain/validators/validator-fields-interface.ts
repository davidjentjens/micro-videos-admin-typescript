export type FieldsErrors = Record<string, string[]>

export interface IValidatorFields<PropsValidated> {
  errors: FieldsErrors | null
  validatedData: PropsValidated | null
  validate: (data: any) => boolean
}
