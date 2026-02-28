import { IsEnum, IsString, IsOptional, IsNumber, IsDateString, IsPositive } from 'class-validator';
import { LancamentoTipo } from '@lexmanager/shared';

export class CreateLancamentoDto {
  @IsEnum(LancamentoTipo)
  tipo: LancamentoTipo;

  @IsString()
  descricao: string;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsDateString()
  dataVencimento: string;

  @IsOptional() @IsString() processoId?: string;
  @IsOptional() @IsString() clienteId?: string;
  @IsOptional() @IsString() categoria?: string;
  @IsOptional() @IsString() observacoes?: string;
}

export class UpdateLancamentoDto {
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsNumber() @IsPositive() valor?: number;
  @IsOptional() @IsDateString() dataVencimento?: string;
  @IsOptional() @IsString() categoria?: string;
  @IsOptional() @IsString() observacoes?: string;
}
