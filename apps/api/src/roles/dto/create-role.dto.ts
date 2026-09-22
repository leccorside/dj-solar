import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'O nome do papel deve usar apenas letras maiúsculas, números e "_" (ex.: COMERCIAL).',
  })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
