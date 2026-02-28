import { IsEnum, IsString, IsOptional, IsDateString, IsArray, IsNumber } from 'class-validator';
import { PrazoTipo, PrazoStatus } from '@lexmanager/shared';

export class CreatePrazoDto {
  @IsString()
  titulo: string;

  @IsEnum(PrazoTipo)
  tipo: PrazoTipo;

  @IsDateString()
  dataVencimento: string;

  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() processoId?: string;
  @IsOptional() @IsString() responsavelId?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  alertas?: number[];
}

export class UpdatePrazoDto {
  @IsOptional() @IsString() titulo?: string;
  @IsOptional() @IsEnum(PrazoTipo) tipo?: PrazoTipo;
  @IsOptional() @IsEnum(PrazoStatus) status?: PrazoStatus;
  @IsOptional() @IsDateString() dataVencimento?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsDateString() dataConclusao?: string;
}
