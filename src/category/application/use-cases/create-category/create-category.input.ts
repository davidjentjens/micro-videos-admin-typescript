import { IsBoolean, IsNotEmpty, IsOptional, IsString, type ValidationError, validateSync } from 'class-validator'

export interface CreateCategoryInputConstructorProps {
  name: string
  description?: string | null
  isActive?: boolean
}

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
    name: string

  @IsString()
  @IsOptional()
    description?: string | null

  @IsOptional()
  @IsBoolean()
    isActive?: boolean

  constructor (props: CreateCategoryInputConstructorProps) {
    if (!props) return
    this.name = props.name
    this.description = props.description
    this.isActive = props.isActive
  }
}

export class ValidateCreateCategoryInput {
  static validate (input: CreateCategoryInput): ValidationError[] {
    return validateSync(input)
  }
}
