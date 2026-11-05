import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearRecintoDto {
  @ApiProperty({
    example: 'Teatro Gran Mariscal',
    description: 'Nombre del recinto cultural',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'Sucre',
    description: 'Ciudad donde se encuentra el recinto',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ciudad: string;

  @ApiProperty({
    example: 500,
    description: 'Aforo máximo del recinto',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  aforo_maximo?: number;
}