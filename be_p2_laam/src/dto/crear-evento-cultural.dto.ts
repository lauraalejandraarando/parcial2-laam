import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoEvento } from '../entities/evento-cultural.entity';

export class CrearEventoCulturalDto {
  @ApiProperty({
    example: 2,
    description: 'ID del recinto donde se realizará el evento',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_recinto: number;

  @ApiProperty({
    example: 'Festival de Música Boliviana',
    description: 'Título del evento cultural',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiProperty({
    example: 'Los Kjarkas',
    description: 'Nombre del artista principal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  artista_principal: string;

  @ApiProperty({
    example: 120,
    description: 'Duración del evento en minutos',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duracion_minutos: number;

  @ApiProperty({
    example: 80.00,
    description: 'Precio de la entrada',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_entrada: number;

  @ApiProperty({
    example: '2026-12-15',
    description: 'Fecha en la que se realizará el evento',
  })
  @IsDateString()
  fecha_evento: string;

  @ApiProperty({
    enum: EstadoEvento,
    example: EstadoEvento.PROGRAMADO,
    description: 'Estado actual del evento',
  })
  @IsEnum(EstadoEvento)
  estado: EstadoEvento;
}