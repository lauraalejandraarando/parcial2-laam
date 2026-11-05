import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  PartialType,
} from '@nestjs/swagger';

import { EventosCulturalesService } from './eventos-culturales.service';
import { CrearEventoCulturalDto } from '../dto/crear-evento-cultural.dto';

class ActualizarEventoCulturalDto extends PartialType(CrearEventoCulturalDto) {}

@ApiTags('Eventos Culturales')
@Controller('eventos-culturales')
export class EventosCulturalesController {
  constructor(
    private readonly eventosCulturalesService: EventosCulturalesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los eventos culturales' })
  @ApiResponse({ status: 200, description: 'Lista de eventos culturales' })
  findAll() {
    return this.eventosCulturalesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un evento cultural por ID' })
  @ApiResponse({ status: 200, description: 'Evento cultural encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosCulturalesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo evento cultural' })
  @ApiBody({ type: CrearEventoCulturalDto })
  @ApiResponse({ status: 201, description: 'Evento cultural creado correctamente' })
  create(@Body() datos: CrearEventoCulturalDto) {
    return this.eventosCulturalesService.create(datos);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento cultural' })
  @ApiBody({ type: ActualizarEventoCulturalDto })
  @ApiResponse({ status: 200, description: 'Evento cultural actualizado correctamente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarEventoCulturalDto,
  ) {
    return this.eventosCulturalesService.update(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un evento cultural' })
  @ApiResponse({ status: 200, description: 'Evento cultural eliminado correctamente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosCulturalesService.remove(id);
  }
}