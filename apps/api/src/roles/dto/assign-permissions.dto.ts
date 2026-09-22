import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  permissionKeys!: string[];
}
