import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ProcessoStatus, AreaDireito } from '@lexmanager/shared';

export class CreateProcessoDto {
  @IsString()
  titulo: string;

  @IsEnum(AreaDireito)
  area: AreaDireito;

  @IsOptional() @IsString() numeroCnj?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() vara?: string;
  @IsOptional() @IsString() tribunal?: string;
  @IsOptional() @IsString() comarca?: string;
  @IsOptional() @IsString() instancia?: string;
  @IsOptional() @IsNumber() valorCausa?: number;
  @IsOptional() @IsDateString() dataDistribuicao?: string;
  @IsOptional() @IsString() responsavelId?: string;
}

export class UpdateProcessoDto {
  @IsOptional() @IsString() titulo?: string;
  @IsOptional() @IsEnum(AreaDireito) area?: AreaDireito;
  @IsOptional() @IsEnum(ProcessoStatus) status?: ProcessoStatus;
  @IsOptional() @IsString() numeroCnj?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() vara?: string;
  @IsOptional() @IsString() tribunal?: string;
  @IsOptional() @IsString() comarca?: string;
  @IsOptional() @IsString() instancia?: string;
  @IsOptional() @IsNumber() valorCausa?: number;
  @IsOptional() @IsDateString() dataDistribuicao?: string;
  @IsOptional() @IsString() responsavelId?: string;
}

export class AddMovimentacaoDto {
  @IsString()
  titulo: string;

  @IsString()
  descricao: string;

  @IsOptional() @IsDateString() dataMovimentacao?: string;
}

export class AddClienteDto {
  @IsString()
  clienteId: string;

  @IsOptional() @IsString() papel?: string;
}
