import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterTenantDto {
  @IsString()
  nomeTenant: string;

  @IsEmail()
  emailTenant: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsString()
  nomeUsuario: string;

  @IsEmail()
  emailUsuario: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Senha deve conter ao menos uma letra maiúscula, uma minúscula e um número',
  })
  senha: string;
}
