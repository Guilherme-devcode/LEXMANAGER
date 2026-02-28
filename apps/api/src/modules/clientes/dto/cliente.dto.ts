import {
  IsEnum,
  IsString,
  IsOptional,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClienteTipo, ClienteStatus } from '@lexmanager/shared';

class EnderecoDto {
  @IsOptional() @IsString() logradouro?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() complemento?: string;
  @IsOptional() @IsString() bairro?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() estado?: string;
  @IsOptional() @IsString() cep?: string;
}

export class CreateClienteDto {
  @IsEnum(ClienteTipo)
  tipo: ClienteTipo;

  @IsString()
  nome: string;

  @IsOptional() @IsString() cpfCnpj?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() celular?: string;
  @IsOptional() @IsString() observacoes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;
}

export class UpdateClienteDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsEnum(ClienteStatus) status?: ClienteStatus;
  @IsOptional() @IsString() cpfCnpj?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() celular?: string;
  @IsOptional() @IsString() observacoes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;
}
