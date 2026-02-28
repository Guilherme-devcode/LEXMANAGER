import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '@lexmanager/shared';

export class CreateUserDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(8)
  senha?: string;
}
